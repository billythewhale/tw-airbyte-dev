from temporalio import activity

@activity.defn(name="greet_melodramatic")
async def greet_melodramatic(name1: str, name2: str) -> str:
    print(f"Running activity greet_melodramatic with args {name1} and {name2}")
    print(f"Activity greet_melodramatic finished")
    return f"Alas, poor {name1}! I knew him, {name2}!"

@activity.defn(name="greet_boring")
async def greet_boring(name1: str, name2: str) -> str:
    return f"Hi, {name1} and {name2}!"
