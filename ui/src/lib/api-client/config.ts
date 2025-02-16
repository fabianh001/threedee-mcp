export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
      'Content-Type': 'application/json',
    },
  } as const;