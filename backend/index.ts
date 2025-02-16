import express from 'express';
import cors from 'cors';
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

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
        MESHY_API_KEY: "msy_zzQl7GKSeSqaMnKa565G6FIBK36BzfVS2kfZ"
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