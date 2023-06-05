import asyncio
from temporalio.client import Client
from workflows import Converse

async def main():
    client = await Client.connect("localhost:7233")
    conversation = await client.execute_workflow(
            Converse.run,
            ["Billy","Bobby"],
            id="converse-1",
            task_queue="default"
    )
    print(f"Result: {conversation}")

if __name__ == "__main__":
    asyncio.run(main())

