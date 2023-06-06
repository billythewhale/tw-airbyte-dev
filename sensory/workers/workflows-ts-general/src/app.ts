import { NativeConnection, Worker } from '@temporalio/worker';
import { getLogger } from '@tw/utils/module/logger';

const logger = getLogger({ name: "workflow" });
async function run() {
  const address = process.env.TEMPORAL_HOST || "localhost";
  logger.info(`TEMPORAL_HOST: ${address}`);

  const connection = await NativeConnection.connect({
    address,
  });
  logger.info("connected");

  const worker = await Worker.create({
    connection,
    workflowsPath: require.resolve('./workflows'),
    taskQueue: 'workflows-queue',
  });
  await worker.run();
}

run().catch((err) => {
  logger.error(err);
  process.exit(1);
});
