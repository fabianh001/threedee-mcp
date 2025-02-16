import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";


const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const MESHY_API_KEY = process.env.MESH_API_KEY;
if (!MESHY_API_KEY) {
  console.error('Missing MESHY_API_KEY environment variable');
  process.exit(1);
}

// Initialize MCP client
const transport = new StdioClientTransport({
    command: "uv",
    args: [
        "--directory",
        "/Users/claudio/Documents/threedee-mcp/mcp/src/threedee",
        "run",
        "threedee-mcp"
    ],
    env: {
      MESHY_API_KEY: MESHY_API_KEY
    }
});

const client = new Client(
  {
    name: "example-client",
    version: "1.0.0"
  },
  {
    capabilities: {
      prompts: {},
      resources: {},
      tools: {}
    }
  }
);

const anthropic = new Anthropic();

// Routes
app.get('/api/prompts', async (req, res) => {
  try {
    const prompts = await client.listPrompts();
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/prompts/:id', async (req, res) => {
  try {
    const prompt = await client.getPrompt(req.params.id, req.query);
    res.json(prompt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/resources', async (req, res) => {
  try {
    const resources = await client.listResources();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/resources/:path', async (req, res) => {
  try {
    const resource = await client.readResource(`file:///${req.params.path}`);
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tools', async (req, res) => {
  try {
    const result = await client.listTools();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tools/:name', async (req, res) => {
  try {
    const result = await client.callTool({
      name: req.params.name,
      arguments: req.body
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const process_prompt = async (prompt: string) => {
  // Process a prompt using Claude and Meshy tools 

  const messages = [
    {
      role: "user",
      content: prompt
    }
  ];

  const response = await client.listTools();
  // console.log('Available tools:', response.tools);

  // create_3d_preview
  const FILTER_TOOLS = ['create_3d_preview']; 

  // const available_tools = response.tools.map(tool => ({
  //   name: tool.name,
  //   description: tool.description,
  //   input_schema: tool.inputSchema
  // }));

  const available_tools = response.tools.filter(tool => FILTER_TOOLS.includes(tool.name)).map(tool => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.inputSchema
  }));
  
  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: messages,
    tools: available_tools
  });
  console.log('Response:', msg);
  

  const tool_use = msg.content.filter(content => content.type === 'tool_use')[0];  
  console.log('Tool use:', tool_use);
  const tool_name = tool_use.name;
  const tool_args = tool_use.input;
  // Execute tool call
  console.log('Tool name:', tool_name);
  const result = await client.callTool({
    name: tool_name,
    arguments: tool_args
  });
  // tool_results.push({ call: tool_name, result });
  console.log('Tool result:', result);

  return { 
    model_response: msg.content,
    tool_results: result.content
  };
}

app.post('/api/generate3d', async (req, res) => {
  try {
    const result = await process_prompt(req.body.prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize connection and start server
async function startServer() {
  try {
    await client.connect(transport);
    console.log('Connected to MCP server');
    
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();