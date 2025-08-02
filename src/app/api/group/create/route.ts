import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

interface AddByExcelRequest {
    uuid: string;
    groupName: string;
    groupId: string | null | '';
}

interface AddByExcelResponse {
    uuid: string;
    groupName: string;
    groupId: string | null;
    groupMemberCount: number | null;
}

export async function POST(req: Request) {
    try {
        const token = req.headers.get('Authorization');
        if (!token) {
            return NextResponse.json({ error: 'Authorization token is required.' }, { status: 401 });
        }

        const body = (await req.json()) as AddByExcelRequest;

        if (!body.uuid || !body.groupName) {
            return NextResponse.json({ error: 'uuid and groupName are required.' }, { status: 400 });
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_PSYA}/psya/user-group/member/add-by-excel`, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
            body: JSON.stringify(body),
            cache: 'no-store',
        });


        if (!res.ok) {
            let message = 'خطا در ثبت اطلاعات.';
            try {
                const contentType = res.headers.get('content-type');
                if (contentType?.includes('application/json')) {
                    const errData = await res.json();
                    message = errData?.message || JSON.stringify(errData);
                } else {
                    const errText = await res.text();
                    message = errText || message;
                }
            } catch (e) {
            }

            return NextResponse.json({ error: message }, { status: res.status });
        }

        const data: AddByExcelResponse = await res.json();

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