import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

interface GroupComboItem {
  value: string;
  caption: string;
  elementStr: string | null;
  extMap: Record<string, unknown>;
}

interface GroupsCustomComboResponse {
  dataList: GroupComboItem[];
  totalCount: number;
  page: number;
  rows: number;
}

export async function GET(req: Request) {
  try {
    const token = req.headers.get('Authorization');

    if (!token) {
      return NextResponse.json({ error: 'Authorization token is required.' }, { status: 401 });
    }

    const url = new URL(req.url);
    const queryString = url.search;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_PSYA}/psya/user-group/introducer/groups-custom-combo${queryString}`, {
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
      const data = await res.json();
      return NextResponse.json({ error: data?.message || 'Failed to fetch combo data.' }, { status: res.status });
    }

    const data: GroupsCustomComboResponse = await res.json();

    const response = NextResponse.json(data, { status: 200 });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unexpected server error.' }, { status: 500 });
  }
}
