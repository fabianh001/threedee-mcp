import { Client } from "../../$node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js";
import { StdioClientTransport } from "../../$node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js";

// const transport = new StdioClientTransport({
//   command: "../python",
//   args: ["server.py"]
// });

export const startClient = async () => {

    const transport = new StdioClientTransport({
        command: "uv",
        args: [
            "run",
            "--directory",
            "/Users/claudio/Documents/threedee-mcp",
            "run",
            "threedee-mcp"
        ],
        env: {
            "MESHY_API_KEY": "msy_zzQl7GKSeSqaMnKa565G6FIBK36BzfVS2kfZ"
        }
    });

    const client = new Client(
    {
        name: "threedee-mcp-client",
        version: "0.0.1"
    },
    {
        capabilities: {
        prompts: {},
        resources: {},
        tools: {}
        }
    }
    );

    await client.connect(transport);

    return client;

}

// // List prompts
// const prompts = await client.listPrompts();
// console.log(prompts);

// // Get a prompt
// const prompt = await client.getPrompt("example-prompt", {
//   arg1: "value"
// });
// console.log(prompt);

// // List resources
// const resources = await client.listResources();
// console.log(resources);

// // Read a resource
// const resource = await client.readResource("file:///example.txt");
// console.log(resource);

// // Call a tool
// const result = await client.callTool({
//   name: "example-tool",
//   arguments: {
//     arg1: "value"
//   }
// });