import {NextResponse} from 'next/server';
import {AxiosApi} from '@/services/axios/AxiosApi';
import {AxiosError} from "axios";
import {getAuthToken} from "@/utils/getAuthToken";

interface ExcelCheckResponse {
    statusEnum: "SUCCESS" | "PROCESSING" | "FAILED";
    filePath?: string | null;
}

export async function GET(_: Request, context: { params: { id: string } }) {
    try {
        const token = await getAuthToken();

        if (!token) {
            return NextResponse.json({error: 'Authorization token is required.'}, {status: 401});
        }

        const {id} = context.params;

        const {data} = await AxiosApi.get<ExcelCheckResponse>(`/report/solo/main-list/excel-export/check/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

        return NextResponse.json(data);
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