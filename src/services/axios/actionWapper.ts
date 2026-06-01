import { serverApi } from '@/services/axios/serverApi';
import { ApiError } from './error-handler'; 
import { AxiosRequestConfig } from 'axios';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; message: string; status?: number };

async function runSafe<T>(request: Promise<{ data: T }>): Promise<ActionResult<T>> {
  try {
    const res = await request;
    return {
      success: true,
      data: res.data,
    };
  } catch (error: any) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        status: error.status,
      };
    }

    return {
      success: false,
      message: 'خطای ناشناخته‌ای رخ داده است',
    };
  }
}

export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    runSafe<T>(serverApi.get(url, config)),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    runSafe<T>(serverApi.post(url, data, config)),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    runSafe<T>(serverApi.put(url, data, config)),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    runSafe<T>(serverApi.patch(url, data, config)),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
    runSafe<T>(serverApi.delete(url, config)),
};
