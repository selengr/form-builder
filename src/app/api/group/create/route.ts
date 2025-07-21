import {NextRequest, NextResponse} from 'next/server';
import {AxiosApi} from '@/services/axios/AxiosApi';
import {AxiosError} from 'axios';
import {getAuthToken} from "@/utils/getAuthToken";

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

export async function POST(req: NextRequest) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({error: 'Authorization token is required.'}, {status: 401});
    }

    const body = (await req.json()) as AddByExcelRequest;

    if (!body.uuid || !body.groupName) {
      return NextResponse.json({error: 'uuid and groupName are required.'}, {status: 400});
    }

    const {data} = await AxiosApi.post<AddByExcelResponse>(
      '/user-group/member/add-by-excel',
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(data, {status: 200});
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