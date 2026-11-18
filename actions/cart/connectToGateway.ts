'use server';

import { api } from '@/services/axios/actionWapper';

export type ConnectToGatewayResult = {
  gatewayUrl: string;
  redirectUrl: string;
  token: string;
};

const readGatewayPayload = (raw: unknown): ConnectToGatewayResult | null => {
  if (!raw || typeof raw !== 'object') return null;

  const obj = raw as Record<string, unknown>;
  const nested = obj.data && typeof obj.data === 'object' ? (obj.data as Record<string, unknown>) : null;
  const source = typeof obj.gatewayUrl === 'string' ? obj : nested;

  if (!source || typeof source.gatewayUrl !== 'string' || source.gatewayUrl.length === 0) {
    return null;
  }

  return {
    gatewayUrl: source.gatewayUrl,
    redirectUrl: typeof source.redirectUrl === 'string' ? source.redirectUrl : '',
    token: typeof source.token === 'string' ? source.token : '',
  };
};

/** `failedRedirectUrl` is derived from success redirect (same as old client `window` replace). */
export async function connectToGatewayAction(redirectUrl: string, amount: number) {
  const failedRedirectUrl = redirectUrl.replace('/success', '/failed');

  const result = await api.post<unknown>(
    '/mhesam/profile/credit/before-gateway',
    { redirectUrl, amount, failedRedirectUrl },
    { baseURL: process.env.BASE_URL },
  );

  if (!result.success) return result;

  const payload = readGatewayPayload(result.data);
  if (!payload) {
    return { success: false as const, message: 'خطا در اتصال به درگاه' };
  }

  return { success: true as const, data: payload };
}
