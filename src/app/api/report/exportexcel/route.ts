import { NextResponse } from 'next/server';
import { z, ZodError } from 'zod';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const exportExcelSchema = z.object({
    takePartIdList: z.array(z.number()).nonempty("لیست افراد نباید خالی باشد"),
});

type ExportExcelPayload = z.infer<typeof exportExcelSchema>;

export async function POST(req: Request) {
    try {
        const token = req.headers.get('Authorization');
        if (!token) {
            return NextResponse.json(
                { error: 'Authorization token is required.' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const parsed = exportExcelSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation error.', details: parsed.error.errors },
                { status: 400 }
            );
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_PSYA}/psya/report/solo/main-list/excel-export`, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
            body: JSON.stringify(parsed.data),
            cache: 'no-store',
        });

        if (!res.ok) {
            const data = await res.json();

            let message = 'An error occurred.';
            if (Array.isArray(data?.message) && data.message[0]?.title) {
                message = data.message[0].title;
            } else if (typeof data?.message === 'string') {
                message = data.message;
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
                { error: 'Validation error', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: error?.message || 'Unexpected server error.' },
            { status: 500 }
        );
    }
}