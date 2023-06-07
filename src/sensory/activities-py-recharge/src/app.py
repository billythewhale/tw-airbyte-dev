import asyncio
import logging
import os
import activities
import auth
import inspect
from temporalio.client import Client
from temporalio.worker import Worker

def get_activities():
    activities_functions = [
        *inspect.getmembers(activities, inspect.isfunction),
        *inspect.getmembers(auth, inspect.isfunction)
    ]

    return {
        member[1]
        for member in activities_functions
        if hasattr(member[1], '__temporal_activity_definition')
    }

async def main():
    host = os.getenv("TEMPORAL_HOST", "localhost")
    logging.info("TEMPORAL_HOST", host)
    client = await Client.connect(f'{host}:7233')

    logging.info(f"Connected to {host}")

    worker = Worker(
        client,
        task_queue="recharge-queue",
        activities=get_activities()
    )
    await worker.run()

if __name__ == "__main__":
    asyncio.run(main())
