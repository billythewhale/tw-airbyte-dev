import { proxyActivities, proxySinks, Sinks } from '@temporalio/workflow';

const { defaultWorkerLogger } = proxySinks<Sinks>();

export async function runCreateCredentials(provider: string, redirect_uri: string, state: string): Promise<string> {
    defaultWorkerLogger.info(JSON.stringify(arguments));
    const providerActivities = proxyActivities({
        taskQueue: `${provider}-queue`,
        startToCloseTimeout: '2 minute',
    });

    return await providerActivities.create_credentials(redirect_uri, state);
}
