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

// HTTPS settings like second version
const httpsAgent = new https.Agent({
  keepAlive: true,
  rejectUnauthorized: process.env.NODE_ENV !== 'development',
});

const DEFAULT_TIMEOUT = 12000;
const DEFAULT_RETRY = 1;

function createErrorResponse(message: string, status: number, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

// Improved error parsing like second file
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
    return raw.error || raw.message || JSON.stringify(raw);
  }
  return 'Unexpected error';
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_SSR?.replace(/\/$/, '');
  if (!baseUrl) {
    logger.error("Missing NEXT_PUBLIC_BASE_URL_SSR in environment");
    return createErrorResponse("API Base URL is not configured", 500);
  }

  const incomingUrl = new URL(req.url);
  const query = method === 'GET' ? incomingUrl.search : '';

  const fullUrl = endpoint.startsWith('http')
    ? `${endpoint}${query}`
    : `${baseUrl}${endpoint}${query}`;

  const headers: Record<string, string> = {
    'Cache-Control': 'no-store',
  };

  // ✅ Improved Auth logic
  const token = req.headers.get('Authorization');
  if (requiresAuth) {
    if (!token?.startsWith('Bearer ')) {
      logger.warn({ endpoint }, "Missing or invalid Authorization token");
      return createErrorResponse("Authorization token Required (Bearer).", 401);
    }
    headers.Authorization = token;
  }

  // ✅ Improved JSON parsing like second version
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
          logger.warn({ errors: parsed.error.flatten() }, "Validation failed");
          return createErrorResponse("Validation error.", 400, parsed.error.flatten());
        }
        requestBody = parsed.data;
      } else requestBody = body;
      headers['Content-Type'] = 'application/json';
    } catch {
      return createErrorResponse("Invalid JSON Body", 400);
    }
  }

  logger.info({ method, fullUrl, endpoint }, "Proxy Request Start");

  const optionsGot: OptionsOfJSONResponseBody = {
    method,
    headers,
    timeout: { request: timeoutMs },
    retry: { limit: retryLimit },
    agent: { https: httpsAgent },
    ...(requestBody && { json: requestBody }),
  };

  try {
    const res = await got(fullUrl, optionsGot);

    const duration = Date.now() - startTime;

    if (res.statusCode >= 400) {
      const msg = extractError(res.body);
      logger.error({ status: res.statusCode, msg, endpoint, duration }, "Proxy Error Response");
      return createErrorResponse(msg, res.statusCode);
    }

    logger.info({ endpoint, status: res.statusCode, duration }, "Proxy Success");
    return NextResponse.json(res.body, { status: res.statusCode });

  } catch (err: any) {
    const duration = Date.now() - startTime;

    if (err instanceof HTTPError && err.response) {
      const msg = extractError(err.response.body);
      logger.error({ endpoint, status: err.response.statusCode, msg, duration }, "HTTPError");
      return createErrorResponse(msg, err.response.statusCode);
    }

    logger.error({ endpoint, error: err.message, duration }, "Proxy Crash");
    return createErrorResponse("Internal Proxy Error", 500);
  }
}

// ✅ Same API as old file (NO breaking changes)
export function handleGetRequest(req: Request, endpoint: string, requiresAuth: boolean = true) {
  return apiProxy(req, { method: 'GET', endpoint, requiresAuth });
}

export function handleApiProxy<T>(req: Request, options: Omit<ApiProxyOptions<T>, 'method'>) {
  return apiProxy(req, { ...options, method: 'POST' });
}