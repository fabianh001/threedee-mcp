
  
  export interface Resource {
    path: string;
    content: string;
  }
  
  export interface ToolRequest {
    name: string;
    arguments: Record<string, unknown>;
  }
  
  export interface APIError {
    message: string;
    status?: number;
  }
  