import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Simple API service wrapper. Keeps all network logic in one place.
// NOTE: For React Native, you may want to map envs via react-native-config or
// use a build-time env substitution. For now, it reads from process.env.

const BASE_URL = process.env.API_BASE_URL || 'https://api.example.com';

class ApiService {
  private client: AxiosInstance;

  constructor(baseURL = BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add JWT if present
    this.client.interceptors.request.use(async (config) => {
      try {
        // Replace with your auth token retrieval
        const token = await this.getAuthToken();
        if (token && config && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        // ignore
      }
      return config;
    });

    // Response interceptor - place for central error handling / telemetry
    this.client.interceptors.response.use(
      (res) => res,
      async (error) => {
        // Simple retry logic for idempotent GETs and network errors
        const { config } = error;
        if (!config) return Promise.reject(error);

        config.__retryCount = config.__retryCount || 0;
        const MAX_RETRIES = 2;
        if (config.__retryCount < MAX_RETRIES && this.isRetryable(error)) {
          config.__retryCount = 1;
          await this.wait(300 * config.__retryCount);
          return this.client(config);
        }
        return Promise.reject(error);
      }
    );
  }

  private isRetryable(error: any): boolean {
    if (!error || !error.code) return false;
    // Retry on network errors/timeouts
    return ['ECONNABORTED', 'ETIMEDOUT', 'ENETUNREACH'].includes(error.code) || !error.response;
  }

  private wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async getAuthToken(): Promise<string | null> {
    // TODO: replace this stub with your secure token storage (SecureStore, Keychain, etc.)
    try {
      // e.g., return await SecureStore.getItemAsync('access_token');
      return null;
    } catch {
      return null;
    }
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.client.get<T>(url, config).then((r: AxiosResponse<T>) => r.data);
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.post<T>(url, data, config).then((r: AxiosResponse<T>) => r.data);
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.put<T>(url, data, config).then((r: AxiosResponse<T>) => r.data);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.client.delete<T>(url, config).then((r: AxiosResponse<T>) => r.data);
  }
}

const api = new ApiService();
export default api;