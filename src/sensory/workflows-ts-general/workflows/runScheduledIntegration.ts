import { proxyActivities, sleep, proxySinks, Sinks } from '@temporalio/workflow';
import * as wf from '@temporalio/workflow';

const { defaultWorkerLogger } = proxySinks<Sinks>();

// From '@tw/types/module/services/sensory/temporal' 
type IntegrationjobDefinition =
  | {
      unit: 'minute' | 'hour' | 'day' | 'week' | 'month';
      count: number;
      level: 'full' | 'light';
      startDate?: string;
    }
  | { dates: string[]; level: 'full' | 'light'; currency: string };

type IntegrationArgs = {
  providerId: string;
  integrationId: string;
  providerAccountId: string;
  schedule?: string;
  currency: string;
  timezone: string;
  jobDefinition: IntegrationjobDefinition;
  credentialId: string;
  providerAccountName: string;
  assetType: string;
  customArgs?: object;
};
// END


export async function runScheduledIntegration(
    integrationDetails: IntegrationArgs
): Promise<boolean|undefined> {
    const {
        integrationId,
        providerId,
        assetType: activityName,
        schedule,
        timezone,
        jobDefinition,
        credentialId,
        providerAccountId,
        providerAccountName
    } = integrationDetails;

    try {
        setHandlers();

        const providerActivities = proxyActivities({
            taskQueue: `${providerId}-queue`,
            startToCloseTimeout: '2 minute'
        });

        const generalActivities = proxyActivities({
            taskQueue: 'activities-general-queue',
            startToCloseTimeout: '2 minute'
        });

        defaultWorkerLogger.info(
            `Started scheduled workflow ${schedule}`
        );
        let n = 0;
        while (!n) {
            try {
                await wf.condition(() => !isPaused);

                const { credentials } = (await generalActivities["callServiceEndpointActivity"]("integration", "auth", { credential_id: credentialId }, { method: "GET" })) || {};
                if (!credentials) {
                    defaultWorkerLogger.error("credentials not found");
                    throw new Error("credentials.data not found");
                }
                await providerActivities[activityName](integrationDetails, credentials);
                defaultWorkerLogger.info(`Ran activity ${activityName} - Done`);

                n++;

            } catch (e) {
                defaultWorkerLogger.error(`Failed to run activity ${activityName} ${e}`);
                defaultWorkerLogger.warn('Stopping workflow');
                isPaused = true;
            }
        }
    } catch (err) {
        defaultWorkerLogger.error(`Failed to start scheduled workflow ${err}`);
        return false;
    }
}

const pauseWorkflow = wf.defineSignal('pauseWorkflow');
const resumeWorkflow = wf.defineSignal('resumeWorkflow');

let isPaused = false;
let note = '';

function setHandlers() {
    wf.setHandler(pauseWorkflow, () => {
        defaultWorkerLogger.info('pauseWorkflow signal received');
        isPaused = true;
        note = 'Workflow is paused';
    });

    wf.setHandler(resumeWorkflow, () => {
        defaultWorkerLogger.info('resumeWorkflow signal received');
        isPaused = false;
        note = 'Workflow is resumed';
    });
}

