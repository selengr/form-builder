import { NextRequest, NextResponse } from 'next/server';
import { AxiosApi } from '@/services/axios/AxiosApi';
import { AxiosError } from 'axios';
import {getAuthToken} from "@/utils/getAuthToken";

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

export async function GET(req: NextRequest) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({error: 'Authorization token is required.'}, {status: 401});
    }

    const url = new URL(req.url);
    const queryString = url.search;

    const { data } = await AxiosApi.get<GroupsCustomComboResponse>(
      `/user-group/introducer/groups-custom-combo${queryString}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;
      return NextResponse.json({ error: message }, { status });
    } else if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'An unknown error occurred.' }, { status: 500 });
  }
}