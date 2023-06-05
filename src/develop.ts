import { spawn } from 'child_process';
import chalk from 'chalk';
import readline from 'readline';

const colors = {
  workflow: '#f0f',
  activity: '#0ff',
  execution: '#ff0',
};

const workflowWorker = spawn('ts-node', ['src/worker.ts']);
workflowWorker.stdout.on('data', data=>console.log(chalk.hex(colors.workflow)('Workflow: ') + data.toString()));
workflowWorker.stderr.on('data', data=>console.log(chalk.hex(colors.workflow)('Workflow: ') + data.toString()));

const activityWorker = spawn('python3', ['src/activity_worker.py']);
activityWorker.stdout.on('data', data=>console.log(chalk.hex(colors.activity)('Activity: ') + data.toString()));
activityWorker.stderr.on('data', data=>console.log(chalk.hex(colors.activity)('Activity: ') + data.toString()));

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  }
  if (key.name === 'return') {
    const workflowExecution = spawn('temporal', ['workflow', 'start', '--type', 'main', '-t', 'tutorial-workflow']);
    workflowExecution.stdout.on('data', data=>console.log(chalk.hex(colors.execution)('Execution: ') + data.toString()));
    workflowExecution.stderr.on('data', data=>console.log(chalk.hex(colors.execution)('Execution: ') + data.toString()));
  }
});

