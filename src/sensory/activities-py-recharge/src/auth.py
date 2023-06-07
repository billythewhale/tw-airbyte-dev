from temporalio import activity
import requests
import json

from sensory_py_utils import logger

@activity.defn
async def create_credentials(redirecte_uri: str, state: str) -> json:
    # TODO: get client id from env variable from secret manager.
    CLIENT_ID = "client_id"
    RECHARGE_OAUTH_ENDPOINT = "https://www.admin.rechargeapps.com/oauth/token"
    HEADERS = {"Content-Type": "application/x-www-form-urlencoded"}
    DATA = {
        "code": state,
        "grant_type": "authorization_code",
        "redirect_uri": redirecte_uri,
        "client_id": CLIENT_ID
    }

    try:
        result = requests.post(
            RECHARGE_OAUTH_ENDPOINT,
            data=DATA,
            headers=HEADERS
        )

        result.raise_for_status()

        return result.json()

    except Exception as e:
        logger.error(f"Can't get access token. {e, redirecte_uri, state}")
        raise e


@activity.defn
async def get_accounts(credential: dict) -> list:
    try:
        if not credential.get("access_token"):
            logger.error("access_token not found")
            raise IndexError("access_token not found")

        RECHARGE_ACCESS_TOKEN = credential.get("access_token")
        RECHARGE_GET_STORE_ENDPOINT = "https://api.rechargeapps.com/store"
        HEADERS = {
            'content-type': 'application/json',
            'X-Recharge-Access-Token': RECHARGE_ACCESS_TOKEN,
            'X-Recharge-Version': '2021-11',
        }

        result = requests.get(RECHARGE_GET_STORE_ENDPOINT, headers=HEADERS)

        result.raise_for_status()

        store = result.json().get("store")
        store["provider_id"] = "recharge"
        store["account_id"] = store["id"]
        store["account_name"] = store["name"]
        store["timezone"] = store["timezone"]
        store["currency"] = store["currency"]

        # TODO: convert timezone to IANA timezone format. and check if there always a iana timezone.

        return [json.dumps(store)]

    except Exception as e:
        logger.error(f"Failed to get recharge store. {e}")
        raise e
