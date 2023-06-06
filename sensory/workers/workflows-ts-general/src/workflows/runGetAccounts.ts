import { proxyActivities, proxySinks, Sinks } from '@temporalio/workflow';

const { defaultWorkerLogger } = proxySinks<Sinks>();

export async function runGetAccounts(provider: string, credentials: any): Promise<string> {
    defaultWorkerLogger.info(JSON.stringify(arguments));
    const providerActivities = proxyActivities({
        taskQueue: `${provider}-queue`,
        startToCloseTimeout: '2 minute',
    });

    return await providerActivities.get_accounts(credentials);
}
