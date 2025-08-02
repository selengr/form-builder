import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(req: Request) {
    try {
        const token = req.headers.get('Authorization');

        if (!token) {
            return NextResponse.json({ error: 'Authorization token is required.' }, { status: 401 });
        }

        const url = new URL(req.url);
        const queryString = url.search;

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_PSYA}/psya/user-group/introducer/group-listgrid${queryString}`, {
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
            return NextResponse.json({ error: errData?.message || 'Failed to fetch data from backend' }, { status: res.status });
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