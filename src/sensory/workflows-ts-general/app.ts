import { NativeConnection, Worker } from "@temporalio/worker";
import { workflowLogger } from "../../logger";

export async function run() {
  const address = process.env.TEMPORAL_HOST || "localhost";
  workflowLogger.info(`TEMPORAL_HOST: ${address}`);

  const connection = await NativeConnection.connect({
    address,
  });
  workflowLogger.info("connected");

  const worker = await Worker.create({
    connection,
    workflowsPath: require.resolve("./workflows"),
    taskQueue: "workflows-queue",
  });
  await worker.run();
}

if (require.main === module) {
  run().catch((err) => {
    workflowLogger.error(err);
    process.exit(1);
  });
}
