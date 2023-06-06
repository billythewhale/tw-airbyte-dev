import { proxyActivities } from "@temporalio/workflow";

interface pythonActivities {
  greet_melodramatic(name1: string, name2: string): Promise<string>;
}

const { greet_melodramatic } = proxyActivities<pythonActivities>({
  taskQueue: 'tutorial-activity',
  startToCloseTimeout: '5m',
});

export async function main(): Promise<string> {
  const greeting = await greet_melodramatic('World', 'Temporal');
  return greeting;
}

