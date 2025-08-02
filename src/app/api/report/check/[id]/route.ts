import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

interface ExcelCheckResponse {
    statusEnum: 'SUCCESS' | 'PROCESSING' | 'FAILED';
    filePath?: string | null;
}

export async function GET(req: Request, context: { params: { id: string } }) {
    try {
        const token = req.headers.get('Authorization');

        if (!token) {
            return NextResponse.json({ error: 'Authorization token is required.' }, { status: 401 });
        }

        const { id } = context.params;

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_PSYA}/psya/report/solo/main-list/excel-export/check/${id}`, {
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

        const data: ExcelCheckResponse = await res.json();

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