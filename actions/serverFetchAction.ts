'use server';

import { api } from '@/services/axios/actionWapper';

export async function serverFetch(url: string, params: Record<string, any> = {}) {
  const queryString = JSON.stringify(params);
  const encodedParams = encodeURIComponent(queryString);
  const fullURL = `${url}${encodedParams === encodeURIComponent('{}') ? '' : encodedParams}`;

  const res = await api.get(fullURL);

  if (!res.success) {
    return {
      ok: false as const,
      data: null,
      status: res.status ?? 500,
      message: res.message || 'خطای نامشخص',
    };
  }

  return {
    ok: true as const,
    data: res.data ?? null,
    status: 200,
  };
}
