import { NextResponse } from 'next/server';
import { ZodError, ZodSchema } from 'zod';
import got, { HTTPError, OptionsOfJSONResponseBody } from 'got';
import https from 'https';
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'debug',
  redact: ['headers.authorization', 'headers.cookie'],
});

// Response caching config for Next
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

interface ApiProxyOptions<T> {
  schema?: ZodSchema<T>;
  endpoint: string;
  requiresAuth?: boolean;
  method?: 'GET' | 'POST';
  timeoutMs?: number;
  retryLimit?: number;
  body?: T;
}

const httpsAgent = new https.Agent({
  keepAlive: true,
  rejectUnauthorized: process.env.NODE_ENV !== 'development',
});

const DEFAULT_TIMEOUT = 12000;
const DEFAULT_RETRY = 1;

function createErrorResponse(message: string, status: number, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

function extractError(raw: any): string {
  if (!raw) return 'Unknown error';
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return parsed.error || parsed.message || raw;
    } catch {
      return raw;
    }
  }
  if (typeof raw === 'object') {
    return (raw as any).error || (raw as any).message || JSON.stringify(raw);
  }
  return 'Unexpected error';
}

/**
 * Normalize base URL:
 * - add http:// if base starts with '//' or has no protocol
 * - remove trailing slash
 */
function normalizeBaseUrl(rawBase?: string): string | null {
  if (!rawBase) return null;
  let b = rawBase.trim();

  // if someone provided something like "//gateway:8080" add http:
  if (b.startsWith('//')) b = 'http:' + b;

  // if no protocol, assume http
  if (!/^https?:\/\//i.test(b)) b = 'http://' + b;

  // remove trailing slash
  b = b.replace(/\/+$/, '');

  return b;
}

export async function apiProxy<T>(req: Request, options: ApiProxyOptions<T>): Promise<NextResponse> {
  const startTime = Date.now();
  const {
    schema,
    endpoint,
    requiresAuth = true,
    method = 'GET',
    timeoutMs = DEFAULT_TIMEOUT,
    retryLimit = DEFAULT_RETRY,
    body: customBody,
  } = options;

  logger.debug({ method, endpoint }, 'Proxy request started');

  // normalize base
  const rawBase = process.env.NEXT_PUBLIC_BASE_URL_SSR;
  const base = normalizeBaseUrl(rawBase);
  if (!base) {
    logger.error('NEXT_PUBLIC_BASE_URL_SSR is not configured or empty');
    return createErrorResponse('API Base URL is not configured', 500);
  }

  // prepare query (keep query from incoming request for GET)
  const incomingUrl = new URL(req.url);
  const query = method === 'GET' ? incomingUrl.search : '';

  // determine fullUrl safely
  let fullUrl: string;
  try {
    if (/^https?:\/\//i.test(endpoint)) {
      // endpoint already absolute
      fullUrl = endpoint + query;
    } else {
      // ensure endpoint path starts with a slash for URL constructor
      const endpointPath = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
      // new URL(endpointPath, base) will resolve properly and produce absolute URL with protocol
      fullUrl = new URL(endpointPath + query, base).toString();
    }
  } catch (e) {
    logger.error({ endpoint, base, err: (e as Error).message }, 'Failed to construct fullUrl');
    return createErrorResponse('Invalid target URL', 500);
  }

  // build headers
  const headers: Record<string, string> = {
    'Cache-Control': 'no-store',
  };

  const token = req.headers.get('Authorization');
  if (requiresAuth) {
    if (!token?.startsWith('Bearer ')) {
      logger.warn({ endpoint }, 'Missing or invalid Authorization token');
      return createErrorResponse('Authorization token Required (Bearer).', 401);
    }
    headers.Authorization = token;
  }

  // prepare request body if any
  let requestBody: any;
  const canHaveBody = ['POST', 'PUT', 'PATCH'].includes(method);
  if (customBody) {
    requestBody = customBody;
    headers['Content-Type'] = 'application/json';
  } else if (canHaveBody && req.headers.get('Content-Type')?.includes('application/json')) {
    try {
      const body = await req.json();
      if (schema) {
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
          logger.warn({ errors: parsed.error.flatten() }, 'Validation failed');
          return createErrorResponse('Validation error.', 400, parsed.error.flatten());
        }
        requestBody = parsed.data;
      } else {
        requestBody = body;
      }
      headers['Content-Type'] = 'application/json';
    } catch (e) {
      logger.warn({ err: (e as Error).message }, 'Invalid JSON Body');
      return createErrorResponse('Invalid JSON Body', 400);
    }
  }

  logger.debug(
    {
      method,
      fullUrl,
      requiresAuth,
      headers: { ...headers, Authorization: headers.Authorization ? '[REDACTED]' : undefined },
      hasBody: !!requestBody,
    },
    'Proxying to upstream'
  );

  const optionsGot: OptionsOfJSONResponseBody = {
    method,
    headers,
    timeout: { request: timeoutMs },
    retry: { limit: retryLimit },
    agent: { https: httpsAgent },
    responseType: 'json',
    throwHttpErrors: false,
    ...(requestBody !== undefined && { json: requestBody }),
  };

  try {
    const res = await got(fullUrl, optionsGot);
    const duration = Date.now() - startTime;

    if (res.statusCode >= 400) {
      const msg = extractError(res.body);
      logger.error({ status: res.statusCode, endpoint, duration, msg }, 'Upstream returned error');
      return createErrorResponse(msg, res.statusCode);
    }

    logger.info({ endpoint, status: res.statusCode, duration }, 'Upstream success');
    return NextResponse.json(res.body, { status: res.statusCode });
  } catch (err: any) {
    const duration = Date.now() - startTime;

    // got HTTPError has response, but we set throwHttpErrors: false so HTTPError unlikely — handle generically
    logger.error({ endpoint, duration, err: err?.message || err }, 'Proxy Crash');
    if (err instanceof ZodError) {
      return createErrorResponse('Validation error.', 400, err.flatten());
    }
    if (err instanceof HTTPError && err.response) {
      const msg = extractError(err.response.body);
      return createErrorResponse(msg, err.response.statusCode ?? 500);
    }

    return createErrorResponse('Internal Proxy Error', 500);
  }
}

// keep old exported names so you don't need to change 130 callers
export function handleGetRequest(req: Request, endpoint: string, requiresAuth: boolean = true) {
  return apiProxy(req, { method: 'GET', endpoint, requiresAuth });
}

export function handleApiProxy<T>(req: Request, options: Omit<ApiProxyOptions<T>, 'method'>) {
  return apiProxy(req, { ...options, method: 'POST' });
}
