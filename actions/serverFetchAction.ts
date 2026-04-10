'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function serverFetch(url: string, params: Record<string, any> = {}) {
  try {
    const queryString = JSON.stringify(params);
    const encodedParams = encodeURIComponent(queryString);
    const fullURL = `${url}${encodedParams === encodeURIComponent('{}') ? '' : encodedParams}`;

    const response = await serverApi.get(fullURL);

    return {
      ok: true as const,
      data: response.data ?? null,
      status: response.status,
    };
  } catch (error: any) {
    return {
      ok: false as const,
      data: null,
      status: error?.response?.status ?? 500,
      message: error?.response?.data?.message?.[0]?.title ||
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      'خطای نامشخص'
    };
  }
}