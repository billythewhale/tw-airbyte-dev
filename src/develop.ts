import readline from "readline";
import { spawn } from "child_process";
import chalk from "chalk";
import { nanoid } from "nanoid";
import { Connection, Client } from "@temporalio/client";
import { run as workflowWorker } from "./sensory/workflows-ts-general/app";
import { resultsLogger, activityLogger } from "./logger";

workflowWorker().then((result) => {
  resultsLogger.info('Workflow worker result: ' + result);
});

const activityWorker = spawn("python3", ["src/activity_worker.py"]);
activityWorker.stdout.on("data", activityLogger.info);
activityWorker.stderr.on("data", activityLogger.error);

const promise = new Promise((res) => setTimeout(res, 2000));
promise.then(() => {
  console.clear();
  console.log("Open http://localhost:8233 to see the Temporal Server Web UI");
  console.log("\nPress enter to start a new workflow execution...");
  console.log("Press ctrl-c to exit\n\n");
});

if (require.main === module) {
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  process.stdin.on("keypress", (str, key) => {
    if (key.ctrl && key.name === "c") {
      process.exit(0);
    }
    if (key.name === "return") {
      executeWorkflow().then((result) => {
        resultsLogger.info(result);
      });
    }
  });
}

type RunCreateCredentialsWorkflowFunction = (provider: string, redirect_uri: string, state: string) => Promise<string>

async function executeWorkflow(): Promise<string> {
  const connection = await Connection.connect();
  try {
    const client = new Client({ connection });

    const handle = await client.workflow.start<RunCreateCredentialsWorkflowFunction>(main, {
      args: [],
      workflowId: `example-${nanoid()}`,
      taskQueue: "tutorial-workflow",
    });

    return handle.result();
  } catch (err) {
    console.error(err);
    await connection.close();
    process.exit(1);
  }
}
