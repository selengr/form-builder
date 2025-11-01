import { NextResponse } from 'next/server';
import { ZodError, ZodSchema } from 'zod';
import got from 'got';
import pino from 'pino';

const logger = pino({
  level: 'debug',
  redact: ['headers.authorization'], // جلوگیری از نمایش توکن
});

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

interface ApiProxyOptions<T> {
  schema?: ZodSchema<T>;
  endpoint: string;
  requiresAuth?: boolean;
  method?: 'GET' | 'POST';
}

async function parseError(error: any): Promise<{ error: string; status: number }> {
  let message = 'An unexpected error occurred.';
  let status = 500;

  if (error.response) {
    status = error.response.statusCode ?? 500;

    try {
      const errData = error.response.body ? JSON.parse(error.response.body) : null;
      if (Array.isArray(errData?.error) && errData.error[0]?.title) {
        message = errData.error[0].title;
      } else if (typeof errData?.error === 'string') {
        message = errData.error;
      } else if (typeof errData?.message === 'string') {
        message = errData.message;
      }
    } catch {
      message = error.response.body || message;
    }
  }

  return { error: message, status };
}

async function apiProxy<T>(req: Request, options: ApiProxyOptions<T>): Promise<NextResponse> {
  const startTime = Date.now();
  const { schema, endpoint, requiresAuth = true, method = 'GET' } = options;

  let requestLog: any = {
    type: 'request',
    method,
    endpoint,
    url: req.url,
    requiresAuth,
    headers: Object.fromEntries(req.headers.entries()),
  };

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    };

    if (requiresAuth) {
      const token = req.headers.get('Authorization');
      if (!token) {
        logger.warn({ requestLog }, 'Unauthorized request');
        return NextResponse.json({ error: 'Authorization token is required.' }, { status: 401 });
      }
      headers['Authorization'] = token;
    }

    let body;
    let searchParams: string | undefined;

    if (method === 'POST' && schema) {
      const rawBody: unknown = await req.json();
      requestLog.body = rawBody;

      const parsed = schema.safeParse(rawBody);
      if (!parsed.success) {
        logger.warn({ requestLog, validationError: parsed.error.errors }, 'Validation error on request');
        return NextResponse.json({ error: 'Validation error.', details: parsed.error.errors }, { status: 400 });
      }
      body = JSON.stringify(parsed.data);
    } else {
      const url = new URL(req.url);
      searchParams = url.searchParams.toString();
      requestLog.query = searchParams;
    }

    logger.debug(requestLog, 'Proxy Request Sent');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_PSYA_SSR;
    const fullUrl = `${baseUrl}${endpoint}${searchParams ? '?' + searchParams : ''}`;

    const response = await got(fullUrl, {
      method,
      headers,
      body,
      responseType: 'json',
      throwHttpErrors: true,
    });

    const duration = Date.now() - startTime;

    logger.info(
      {
        type: 'response',
        endpoint,
        statusCode: response.statusCode,
        duration,
        responseBody: response.body,
      },
      'Proxy Response Received'
    );

    const nextRes = NextResponse.json(response.body, { status: 200 });
    return nextRes;

  } catch (err: any) {
    const duration = Date.now() - startTime;
    const { error, status } = await parseError(err);

    logger.error(
      {
        type: 'error',
        endpoint,
        duration,
        status,
        rawError: err.message,
        requestLog,
      },
      'Proxy Error Occurred'
    );

    return NextResponse.json({ error }, { status });
  }
}

export function handleGetRequest(req: Request, endpoint: string, requiresAuth: boolean = true) {
  return apiProxy(req, { method: 'GET', endpoint, requiresAuth });
}

export function handleApiProxy<T>(req: Request, options: Omit<ApiProxyOptions<T>, 'method'>) {
  return apiProxy(req, { ...options, method: 'POST' });
}