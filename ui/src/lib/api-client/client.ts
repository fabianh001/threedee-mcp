import { API_CONFIG } from './config';
import type { Prompt, Resource, ToolRequest, APIError } from './types';

class APIClient {
  private baseURL: string;
  private headers: HeadersInit;

  constructor(config = API_CONFIG) {
    this.baseURL = config.baseURL;
    this.headers = config.headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      console.log("REQUESTING", endpoint);
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'An error occurred');
      }
      const result = await response.json();

      return result
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): APIError {
    if (error instanceof Error) {
      return {
        message: error.message,
        status: error instanceof Response ? error.status : undefined,
      };
    }
    return {
      message: 'An unknown error occurred',
    };
  }

  // Prompts
  async listPrompts(): Promise<Prompt[]> {
    return this.request<Prompt[]>('/prompts');
  }

  async getPrompt(id: string, args?: Record<string, unknown>): Promise<Prompt> {
    const queryParams = args ? `?${new URLSearchParams(args as Record<string, string>)}` : '';
    return this.request<Prompt>(`/prompts/${id}${queryParams}`);
  }

  // Resources
  async listResources(): Promise<Resource[]> {
    return this.request<Resource[]>('/resources');
  }

  // Tools
  async listTools(): Promise<string[]> {
    return this.request<string[]>('/tools');
  }

  async getResource(path: string): Promise<Resource> {
    return this.request<Resource>(`/resources/${encodeURIComponent(path)}`);
  }

  // Tools
  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    return this.request<unknown>(`/tools/${name}`, {
      method: 'POST',
      body: JSON.stringify(args),
    });
  }

  async generate3D(prompt: string): Promise<{ model_response: object, tool_results: object[] }> {
    return this.request('/generate3D', {
      method: 'POST',
      body: JSON.stringify({
        prompt: prompt
      }),
    });
  }
}

// Create a singleton instance
export const apiClient = new APIClient();