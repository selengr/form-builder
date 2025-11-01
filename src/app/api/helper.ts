import { NextResponse } from 'next/server';
import { ZodError, ZodSchema } from 'zod';
import got from 'got';
import { pine } from 'pine';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

interface ApiProxyOptions<T> {
  schema?: ZodSchema<T>;
  endpoint: string;
  requiresAuth?: boolean;
  method?: 'GET' | 'POST';
}

const logger = pine.getLogger('API-PROXY');

async function parseError(error: any): Promise<{ error: string; status: number }> {
  let message = 'An unexpected error occurred.';
  let status = 500;

  logger.error('🧨 Error Response Received', {
    fullError: error?.response?.body,
    statusCode: error?.response?.statusCode,
    headers: error?.response?.headers,
  });

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
      } else if (errData) {
        message = JSON.stringify(errData);
      }
    } catch {
      message = error.response.body || message;
    }
  }

  return { error: message, status };
}

async function apiProxy<T>(req: Request, options: ApiProxyOptions<T>): Promise<NextResponse> {
  const { schema, endpoint, requiresAuth = true, method = 'GET' } = options;

  const start = performance.now();
  const requestId = crypto.randomUUID();

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    };

    if (requiresAuth) {
      const token = req.headers.get('Authorization');
      if (!token) {
        logger.warn('🚫 Missing Auth Token', { endpoint, method, requestId });
        return NextResponse.json({ error: 'Authorization token is required.' }, { status: 401 });
      }
      headers['Authorization'] = token;
    }

    let body;
    let searchParams: string | undefined;

    if (method === 'POST' && schema) {
      const rawBody: unknown = await req.json();
      const parsed = schema.safeParse(rawBody);
      if (!parsed.success) {
        logger.warn('⚠️ Validation Failed', {
          requestId,
          endpoint,
          details: parsed.error.errors,
        });
        return NextResponse.json({ error: 'Validation error.', details: parsed.error.errors }, { status: 400 });
      }
      body = JSON.stringify(parsed.data);
    } else {
      const url = new URL(req.url);
      searchParams = url.searchParams.toString();
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_PSYA_SSR;
    const fullUrl = `${baseUrl}${endpoint}${searchParams ? '?' + searchParams : ''}`;

    logger.info('📤 Outgoing Request', {
      requestId,
      method,
      endpoint,
      url: fullUrl,
      headers,
      ...(body && { body }),
    });

    const response = await got(fullUrl, {
      method,
      headers,
      body,
      responseType: 'json',
      throwHttpErrors: true,
    });

    const duration = performance.now() - start;
    logger.info('✅ Successful Response', {
      requestId,
      endpoint,
      status: response.statusCode,
      durationMs: duration.toFixed(2),
      responseBody: response.body,
    });

    const nextRes = NextResponse.json(response.body, { status: response.statusCode });
    nextRes.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    nextRes.headers.set('Pragma', 'no-cache');
    nextRes.headers.set('Expires', '0');

    return nextRes;
  } catch (err: any) {
    const duration = performance.now() - start;
    logger.error('❌ Request Failed', {
      requestId,
      endpoint,
      durationMs: duration.toFixed(2),
      error: err.message,
    });

    if (err instanceof ZodError) {
      return NextResponse.json({ error: 'Validation error.', details: err.errors }, { status: 400 });
    }

    const { error, status } = await parseError(err);
    return NextResponse.json({ error }, { status });
  }
}

export function handleGetRequest(req: Request, endpoint: string, requiresAuth: boolean = true) {
  return apiProxy(req, { method: 'GET', endpoint, requiresAuth });
}

export function handleApiProxy<T>(req: Request, options: Omit<ApiProxyOptions<T>, 'method'>) {
  return apiProxy(req, { ...options, method: 'POST' });
}