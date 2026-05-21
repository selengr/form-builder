import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig } from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/authConfig';

export const runtime = 'nodejs';

/* =========================
   HTTP STATUS ENUM
========================= */

enum HttpStatus {
  UNAUTHORIZED = 401,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

/* =========================
   AXIOS CONFIG EXTENSION
========================= */

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retryCount?: number;
    _shouldRetry?: boolean;
    _delay?: number;
  }
}

/* =========================
   AXIOS INSTANCE (SERVER)
========================= */

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
  async (config: any) => {
    const token = await getAccessToken();

    if (token) {
      (config.headers as AxiosHeaders).set(
        'Authorization',
        `Bearer ${token}`,
      );
    }

    config._retryCount ??= 0;
    config._shouldRetry ??= true;
    config._delay ??= 1000;

    return config;
  },
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */

serverApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig | undefined;
    const status = error.response?.status;
    const maxRetries = 3;

    // const retryableStatuses = [
    //   HttpStatus.INTERNAL_SERVER_ERROR,
    //   HttpStatus.BAD_GATEWAY,
    //   HttpStatus.SERVICE_UNAVAILABLE,
    //   HttpStatus.GATEWAY_TIMEOUT,
    // ];

    // if (
    //   config &&
    //   config._shouldRetry &&
    //   config._retryCount! < maxRetries &&
    //   (!status || retryableStatuses.includes(status))
    // ) {
    //   config._retryCount!++;
    //   const delay = config._delay! * config._retryCount!;

    //   console.warn(
    //     `🔁 Retry ${config._retryCount}/${maxRetries} → ${config.method?.toUpperCase()} ${config.url}`,
    //   );

    //   await new Promise((r) => setTimeout(r, delay));
    //   return serverApi(config);
    // }

    console.error('‼️ SERVER API ERROR', {
      url: config?.url,
      method: config?.method,
      status,
      data: error.response?.data,
      message: error.message,
    });

//     throw error;
//   },
// );





       const message = extractErrorMessage(error);

       return Promise.reject(new ApiError(message));


  },
);




export type TApiErrorResponse = {
  message?: string | { title?: string }[];
};

export function extractErrorMessage(error: AxiosError<TApiErrorResponse>): string {
  const data = error.response?.data;

  if (Array.isArray(data?.message)) {
    return data.message[0]?.title || 'انجام عملیات با خطا مواجه شد';
  }

  if (typeof data?.message === 'string') {
    return data.message;
  }

  return 'انجام عملیات با خطا مواجه شد';
}

export class ApiError extends Error {

  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'خطا';
    this.status = status;
  }
}


