'use server';

import { api } from '@/services/axios/actionWapper';

export type ConnectToGatewayResult = {
  gatewayUrl: string;
  redirectUrl: string;
  token: string;
};

/** `failedRedirectUrl` is derived from success redirect (same as old client `window` replace). */
export async function connectToGatewayAction(redirectUrl: string, amount: number) {
  const failedRedirectUrl = redirectUrl.replace('/success', '/failed');

  return api.post<ConnectToGatewayResult>(
    '/mhesam/profile/credit/before-gateway',
    { redirectUrl, amount, failedRedirectUrl },
    { baseURL: process.env.BASE_URL },
  );
}
