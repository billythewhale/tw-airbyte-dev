import readline from "readline";
import { spawn } from "child_process";
import chalk from "chalk";
import { nanoid } from "nanoid";
import { Connection, Client } from "@temporalio/client";
import { main } from "./workflows";

const colors = {
  workflow: "#f0f",
  activity: "#0ff",
  execution: "#ff0",
  results: "#0f0",
};

const buildLogger = (prefix: string, color: string) => (msg: string) =>
  process.stdout.write(
      msg
        .toString()
        .split("\n")
        .map((line) => `${chalk.hex(color)(prefix)}|  ${line}`)
        .join(`\n`) + "\n"
  );

const workflowLogger = buildLogger("Workflow", colors.workflow);
const activityLogger = buildLogger("Activity", colors.activity);
const executionLogger = buildLogger("Execution", colors.execution);
const resultsLogger = buildLogger("Results", colors.results);

const workflowWorker = spawn("ts-node", ["src/worker.ts"]);
workflowWorker.stdout.on("data", workflowLogger);
workflowWorker.stderr.on("data", workflowLogger);

const activityWorker = spawn("python3", ["src/activity_worker.py"]);
activityWorker.stdout.on("data", activityLogger);
activityWorker.stderr.on("data", activityLogger);

const promise = new Promise((res) => setTimeout(res, 2000));
promise.then(() => {
  console.clear();
  console.log('Open http://localhost:8233 to see the Temporal Server Web UI');
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
        resultsLogger(result);
      });
    }
  });
}

async function executeWorkflow() {
  const connection = await Connection.connect();
  try {
    const client = new Client({ connection });

    const handle = await client.workflow.start(main, {
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
