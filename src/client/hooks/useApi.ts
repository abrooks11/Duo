// import context and action types
import { useCallback } from 'react';
import { requestVoicemail } from '../features/voicemail/services/voicemailApi';
import useGlobalContext from './useGlobalContext';

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

interface ApiConfig {
  baseUrl?: string;
  timeout?: number;
  retries?: number;
}

class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private retries: number;

  constructor(config: ApiConfig = {}) {
    this.baseUrl = config.baseUrl || 'http://localhost:3000/api';
    this.timeout = config.timeout || 10000;
    this.retries = config.retries || 3;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data);
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint);
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    attempt = 1
  ): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      let result = [];

      if (endpoint === 'voicemail') {
        result = await requestVoicemail()
      } else {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: data ? JSON.stringify(data) : undefined,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        result = await response.json();
      }

      // console.log('Successful fetch from', endpoint);
      // console.log('Total records:', result.length);
      // console.log('Sample record:', result[0]);

      return {
        data: result,
        success: true,
      };
      
    } catch (error) {
      if (attempt < this.retries && (error as Error).name !== 'AbortError') {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        return this.request<T>(method, endpoint, data, attempt + 1);
      }

      return {
        data: {} as T,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Hook that integrates API client with state management
export const useApiWithState = () => {
  const { dispatch } = useGlobalContext();
  
  const fetchAndDispatch = useCallback(async <T>(
    endpoint: string,
    actionCreator: (data: T) => any,
    setLoading?: (loading: boolean) => any,
    setError?: (error: string | null) => any
  ) => {
    if (setLoading) dispatch(setLoading(true));

    try {
      const response = await apiClient.get<T>(endpoint);
      if (response.success) {
        dispatch(actionCreator(response.data));
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      if (setError) {
        dispatch(
          setError(error instanceof Error ? error.message : 'Unknown error')
        );
      }
    }
  }, [dispatch]);

  return {
    apiClient,
    fetchAndDispatch
  };
};

export const apiClient = new ApiClient();
export type { ApiResponse };
