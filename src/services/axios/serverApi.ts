import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/authConfig';
import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import { ApiError, extractErrorMessage, TApiErrorResponse } from './error-handler';

export const runtime = 'nodejs';

export const serverApi = axios.create({
  baseURL: `${process.env.BASE_URL}/psya`,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* =========================
   ACCESS TOKEN (SERVER)
========================= */

async function getAccessToken(): Promise<string | null> {
  try {
    const session: any = await getServerSession(authOptions);
    return session?.access_token ?? null;
  } catch (err) {
    console.error('❌ Failed to get server session', err);
    return null;
  }
}

/* =========================
   REQUEST INTERCEPTOR
========================= */

serverApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();

    if (token) {
      (config.headers as AxiosHeaders).set(
        'Authorization',
        `Bearer ${token}`,
      );
    }

    return config;
  },
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */

serverApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError<TApiErrorResponse>) => {

    const message = extractErrorMessage(error);
    const status = error.response?.status;

    return Promise.reject(new ApiError(message, status));
  },
);
