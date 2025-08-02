import { NextResponse } from 'next/server';
import { z, ZodError, ZodSchema } from 'zod';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

interface ApiProxyOptions<T> {
    schema: ZodSchema<T>;
    endpoint: string;
}

export async function handleApiProxy<T>(req: Request, options: ApiProxyOptions<T>): Promise<NextResponse> {
    try {
        const token = req.headers.get('Authorization');
        if (!token) {
            return NextResponse.json({ error: 'Authorization token is required.' }, { status: 401 });
        }

        const body: unknown = await req.json();
        const parsed = options.schema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation error.', details: parsed.error.errors },
                { status: 400 }
            );
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_PSYA}${options.endpoint}`, {
            method: 'POST',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
                Pragma: 'no-cache',
                Expires: '0',
            },
            body: JSON.stringify(parsed.data),
            cache: 'no-store',
        });

        if (!res.ok) {
            const data = await res.json();
            let message = 'خطایی رخ داده است.';
            if (typeof data?.message === 'string') {
                message = data.message;
            } else if (Array.isArray(data?.message) && data.message[0]?.title) {
                message = data.message[0].title;
            } else if (typeof data?.error === 'string') {
                message = data.error;
            }
            return NextResponse.json({ error: message }, { status: res.status });
        }

        const data = await res.json();
        const response = NextResponse.json(data, { status: 200 });
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        return response;

    } catch (error: any) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Validation error.', details: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: error?.message || 'Unexpected server error.' },
            { status: 500 }
        );
    }
}

export async function handleGetRequest(req: Request, endpoint: string): Promise<NextResponse> {
    try {
        const token = req.headers.get('Authorization');

        if (!token) {
            return NextResponse.json({ error: 'Authorization token is required.' }, { status: 401 });
        }

        const url = new URL(req.url);
        const queryString = url.search;

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_PSYA}${endpoint}${queryString}`, {
            method: 'GET',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
                Pragma: 'no-cache',
                Expires: '0',
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            let message = 'خطا در دریافت اطلاعات از سرور.';
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
                    } else {
                        message = JSON.stringify(errData);
                    }
                } else {
                    const errText = await res.text();
                    message = errText || message;
                }
            } catch (e) {}
            return NextResponse.json({ error: message }, { status: res.status });
        }

        const data = await res.json();

        const response = NextResponse.json(data);
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Unexpected server error.' }, { status: 500 });
    }
}

// تابع کمکی جدید برای درخواست‌های GET با پارامترهای مسیر
export async function handleDynamicGetRequest(req: Request, endpoint: string): Promise<NextResponse> {
    try {
        const token = req.headers.get('Authorization');

        if (!token) {
            return NextResponse.json({ error: 'Authorization token is required.' }, { status: 401 });
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_PSYA}${endpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            const errData = await res.json();
            const message = errData?.message || 'Failed to fetch status.';
            return NextResponse.json({ error: message }, { status: res.status });
        }

        const data = await res.json();

        const response = NextResponse.json(data, { status: 200 });
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;

    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || 'Unexpected server error.' },
            { status: 500 }
        );
    }
}