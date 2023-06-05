import asyncio
import random
import string

from temporalio import activity
from temporalio.client import Client
from temporalio.worker import Worker

from activities import greet_melodramatic

task_queue = "tutorial-activity"

async def main():
    client = await Client.connect("localhost:7233")
    worker = Worker(client, task_queue=task_queue, activities=[greet_melodramatic])
    print(f"Starting worker, listening to queue {task_queue}...")
    await worker.run()
    print("Worker finished")

asyncio.run(main())

