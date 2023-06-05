import { Connection, Client } from "@temporalio/client";
import { main } from "./workflows";
import { nanoid } from "nanoid";

async function run() {
  const connection = await Connection.connect();
  const client = new Client({ connection });

  const handle = await client.workflow.start(main, {
    workflowId: `example-${nanoid()}`,
    taskQueue: 'tutorial-workflow',
  });

  console.log(`Started workflow with workflowId=${handle.workflowId}`);

  console.log(await handle.result());
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
