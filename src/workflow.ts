import IntegrationService from "./mocks/IntegrationsService";
import { proxyActivities } from "@temporalio/workflow";

interface pythonActivities {
  greet_melodramatic(name1: string, name2: string): Promise<string>;
}

const { greet_melodramatic } = proxyActivities<pythonActivities>({
  taskQueue: "tutorial-activity",
  startToCloseTimeout: "5m",
});

export async function main(): Promise<string> {
  const { email, username, key } = await IntegrationService.getCredentials();
  const response1 = await greet_melodramatic(email, username);
  return `${response1}\n${key}`;
}
