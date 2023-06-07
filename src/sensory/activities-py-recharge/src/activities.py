from sharedTypes import IntegrationArgs
from temporalio import activity
import json

from sensory_py_utils import logger, upload_file_to_bucket
from ../../../source_recharge import SourceRecharge
from airbyte_cdk.entrypoint import get_airbyte_data

RECHARGE_BUCKET_NAME = "data-lake-pinterest-python-triple-whale-staging"


def get_recharge_config(integration_deatils: IntegrationArgs, credentials: dict):

    # TODO YOSEF: add validation for start date and credential id.

    return {
        "access_token": credentials.get("access_token", ""),
        "start_date": integration_deatils.jobDefinition.startDate,
    }


def get_recharge_stream(source, config, stream_name):
    logger.info(f"fetch recharge {stream_name}: started")

    try:
        airbyte_response = get_airbyte_data(source, stream_name, config)

        # TODO: Check if we want to parse it in the activity in the utils or in airbyte cdk.
        for data in airbyte_response:
            data = json.loads(data)
            if data.get("type") == "RECORD":
                yield data.get("record").get("data")

    except Exception as e:
        logger.error(f"fetch recharge {stream_name}: failed. {e}")
        raise e

    # TODO: add parallelism + check if needed to save all or nothing.

@activity.defn
async def save_recharge_data_to_bucket(integration_args: IntegrationArgs, credentials: dict) -> str:

    try:
        source = SourceRecharge()
        config = get_recharge_config(integration_args, credentials)
        optional_streams = source.get_avilable_streams(config)

        for stream_name in optional_streams:

            data = list(get_recharge_stream(source, config, stream_name))
            logger.info(f"got {len(data)} {stream_name}")

            logger.info(
                f"saving {stream_name} to bucket {RECHARGE_BUCKET_NAME}")

            args_to_save = {key: integration_args[key] for key in ["integrationId", "providerAccountId", "currency", "timezone", "customArgs"]}
            data_to_save = {
                "integration_args": args_to_save,
                "data": data
            }

            upload_file_to_bucket(
                RECHARGE_BUCKET_NAME,
                json.dumps(data_to_save),
                {},
                f"recharge/{stream_name.lower()}/{stream_name.lower()}.json")

            logger.info("done")

    except Exception as error:
        logger.error(f"failed to save recharge data to bucket: {error}")
        raise error

    return True
