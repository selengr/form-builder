'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export async function serverFetch(url: string, params: Record<string, any> = {}) {
  try {
    const queryString = JSON.stringify(params);
    const encodedParams = encodeURIComponent(queryString);
    const fullURL = `${url}${encodedParams === encodeURIComponent('{}') ? '' : encodedParams}`;

    const response = await AxiosApi.get(fullURL);

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
      message: error?.message ?? 'Error fetching data',
    };
  }
}