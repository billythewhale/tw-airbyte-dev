import { Worker } from "@temporalio/worker";

async function run() {
  const worker = await Worker.create({
<<<<<<< Updated upstream
    workflowsPath: require.resolve('./workflow'),
    taskQueue: 'tutorial-workflow',
=======
    workflowsPath: require.resolve("./workflows"),
    taskQueue: "tutorial-workflow",
>>>>>>> Stashed changes
  });
  await worker.run();
  return worker;
}

run().catch((err) => {
  console.error("Oh no!", err);
  process.exit(1);
});
