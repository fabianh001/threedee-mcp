import { useState, useCallback } from 'react';
import { apiClient } from '../lib/api-client/client';
import type { APIError } from '../lib/api-client/types';

interface APIState<T> {
  data: T | null;
  error: APIError | null;
  isLoading: boolean;
}

interface UseAPIResponse<T> extends APIState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useAPI<T>(
  apiFunction: (...args: any[]) => Promise<T>
): UseAPIResponse<T> {
  const [state, setState] = useState<APIState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
    });
  }, []);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        const result = await apiFunction(...args);
        console.log("API RESULT", result);
        setState(prev => ({ ...prev, data: result, isLoading: false }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error as APIError,
          isLoading: false,
        }));
      }
    },
    [apiFunction]
  );

  return { ...state, execute, reset };
}