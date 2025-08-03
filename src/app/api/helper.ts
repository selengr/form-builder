import { NextResponse } from 'next/server';
import { ZodError, ZodSchema } from 'zod';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

interface ApiProxyOptions<T> {
    schema?: ZodSchema<T>;
    endpoint: string;
    requiresAuth?: boolean;
    method?: 'GET' | 'POST';
}
async function parseError(res: Response): Promise<{ error: string, status: number }> {
    let message = 'An unexpected error occurred.';
    try {
        const contentType = res.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            const errData = await res.json();
            if (Array.isArray(errData?.error) && errData.error[0]?.title) {
                message = errData.error[0].title;
            } else if (typeof errData?.error === 'string') {
                message = errData.error;
            } else if (typeof errData?.message === 'string') {
                message = errData.message;
            } else if (typeof errData === 'string') {
                message = errData;
            } else {
                message = JSON.stringify(errData);
            }
        } else {
            const errText = await res.text();
            message = errText || message;
        }
    } catch (e) {
    }
    return { error: message, status: res.status };
}

async function apiProxy<T>(req: Request, options: ApiProxyOptions<T>): Promise<NextResponse> {
    const { schema, endpoint, requiresAuth = true, method = 'GET' } = options;

    try {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
        });

        if (requiresAuth) {
            const token = req.headers.get('Authorization');
            if (!token) {
                return NextResponse.json({ error: 'Authorization token is required.' }, { status: 401 });
            }
            headers.set('Authorization', token);
        }

        let requestBody = null;
        let queryString = '';

        if (method === 'POST' && schema) {
            const body: unknown = await req.json();
            const parsed = schema.safeParse(body);
            if (!parsed.success) {
                return NextResponse.json({ error: 'Validation error.', details: parsed.error.errors }, { status: 400 });
            }
            requestBody = JSON.stringify(parsed.data);
        } else {
            const url = new URL(req.url);
            queryString = url.search;
        }

        const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL_PSYA}${endpoint}${queryString}`;

        const res = await fetch(fullUrl, {
            method,
            headers,
            body: requestBody,
            cache: 'no-store',
        });

        if (!res.ok) {
            const { error, status } = await parseError(res);
            return NextResponse.json({ error }, { status });
        }

        const data = await res.json();
        const response = NextResponse.json(data, { status: 200 });

        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;

    } catch (error: any) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: 'Validation error.', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: error?.message || 'Unexpected server error.' }, { status: 500 });
    }
}


export function handleGetRequest(req: Request, endpoint: string, requiresAuth: boolean = true): Promise<NextResponse> {
    return apiProxy(req, { method: 'GET', endpoint, requiresAuth });
}

export function handleApiProxy<T>(req: Request, options: Omit<ApiProxyOptions<T>, 'method'>): Promise<NextResponse> {
    return apiProxy(req, { ...options, method: 'POST' });
}