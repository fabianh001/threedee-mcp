from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

# Create server parameters for stdio connection
server_params = StdioServerParameters(
    command="cd", # Executable
    args=[
        "/Users/claudio/Documents/threedee-mcp",
        "&&",
        "uv",
        "run",
        "server.py"
    ],
    env={
        "MESHY_API_KEY": "msy_zzQl7GKSeSqaMnKa565G6FIBK36BzfVS2kfZ"
    }
    # command="uv",
    # args=[
    #     "run",
    #     "server.py"
    # ],
    # env={
    #     "MESHY_API_KEY": "msy_zzQl7GKSeSqaMnKa565G6FIBK36BzfVS2kfZ"
    # }
)

async def run():
    print("RUN function called")
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            print(session)
            print("Session created")
            # Initialize the connection
            await session.initialize()
            print("Session started")

            # List available prompts
            prompts = await session.list_prompts()
            print("prompts:", prompts)

            # Get a prompt
            prompt = await session.get_prompt("example-prompt", arguments={"arg1": "value"})
            print("prompt:", prompt)

            # List available resources
            resources = await session.list_resources()
            print("resources:", resources)

            # List available tools
            tools = await session.list_tools()
            print("tools:", tools)

            # Read a resource
            content, mime_type = await session.read_resource("file://some/path")
            print("content:", content, mime_type)

            # Call a tool
            result = await session.call_tool("tool-name", arguments={"arg1": "value"})
            print("result:", result)

if __name__ == "__main__":
    import asyncio
    asyncio.run(run())