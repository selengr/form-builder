import {NextResponse} from 'next/server';
import {AxiosApi} from '@/services/axios/AxiosApi';
import {AxiosError} from "axios";

export const dynamic = 'force-dynamic';

interface GroupItem {
    groupName: string;
    groupId: number;
    groupMemberCount: number;
}

interface PageableSort {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
}

interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: PageableSort;
    offset: number;
    unpaged: boolean;
    paged: boolean;
}

interface GroupListgridResponse {
    content: GroupItem[];
    pageable: Pageable;
    totalElements: number;
    totalPages: number;
    last: boolean;
    numberOfElements: number;
    size: number;
    number: number;
    sort: PageableSort;
    first: boolean;
    empty: boolean;
}


export async function GET(req: Request) {
    try {
        const token = req.headers.get('Authorization');

        if (!token) {
            return NextResponse.json({error: 'Authorization token is required.'}, {status: 401});
        }

        const url = new URL(req.url);
        const queryString = url.search;

        const {data} = await AxiosApi.get<GroupListgridResponse>(`/user-group/introducer/group-listgrid${queryString}`, {
            headers: {
                Authorization: `${token}`,
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                cache: "no-store"
            },
        });

        const response = NextResponse.json(data);
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        response.headers.set('cache', 'no-store');

        return response;
    } catch (error) {
        if (error instanceof AxiosError) {
            const status = error.response?.status || 500;
            const message = error.response?.data?.message || error.message;
            return NextResponse.json({error: message}, {status});
        } else if (error instanceof Error) {
            return NextResponse.json({error: error.message}, {status: 500});
        }
        return NextResponse.json({error: 'An unknown error occurred.'}, {status: 500});
    }
}