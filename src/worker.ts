import { Worker } from '@temporalio/worker';

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflow'),
    taskQueue: 'tutorial-workflow',
  });
  await worker.run();
  return worker;
}

run().catch((err) => {
  console.error('Oh no!', err);
  process.exit(1);
});
