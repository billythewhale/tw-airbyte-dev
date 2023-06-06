import { proxyActivities, sleep, proxySinks, Sinks } from '@temporalio/workflow';
import cronstrue from 'cronstrue';
import * as cronjsMatcher from '@datasert/cronjs-matcher';
import * as wf from '@temporalio/workflow';
import { IntegrationArgs } from '@tw/types/module/services/sensory/temporal';

const { defaultWorkerLogger } = proxySinks<Sinks>();

export async function runScheduledIntegration(
    integrationDetails: IntegrationArgs
): Promise<boolean> {
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
            `Started scheduled workflow ${cronstrue.toString(schedule)}`
        );
        while (true) {
            try {
                await wf.condition(() => !isPaused);

                const { credentials } = (await generalActivities["callServiceEndpointActivity"]("integration", "auth", { credential_id: credentialId }, { method: "GET" })) || {};
                if (!credentials) {
                    defaultWorkerLogger.error("credentials not found");
                    throw new Error("credentials.data not found");
                }
                await providerActivities[activityName](integrationDetails, credentials);
                defaultWorkerLogger.info(`Ran activity ${activityName} - Done`);

                const shouldSleepFor = getSleepTime(schedule, timezone);
                defaultWorkerLogger.info(
                    `going to sleep for ${shouldSleepFor / 1000} seconds`
                );
                await sleep(shouldSleepFor);
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

function getSleepTime(schedule: string, timezone: string | undefined): number {
    const nextRunTime = cronjsMatcher.getFutureMatches(schedule, {
        matchCount: 2,
        timezone: timezone,
        hasSeconds: false,
        formatInTimezone: true
    });

    if (!nextRunTime.length) {
        defaultWorkerLogger.info('Schedule is invalid - no next run time');
        throw new Error('Schedule is invalid - no next run time');
    }

    // If the next run time is in the past or right now, return the sleep time until the next run time.
    if (Date.parse(nextRunTime[0]) - Date.now() <= 0) {
        return Date.parse(nextRunTime[1]) - Date.now();
    }

    return Date.parse(nextRunTime[0]) - Date.now();
}
