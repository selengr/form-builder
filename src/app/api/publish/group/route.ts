import {NextResponse} from 'next/server';
import {AxiosApi} from '@/services/axios/AxiosApi';
import {z, ZodError} from 'zod';
import {AxiosError} from 'axios';
import {getAuthTokenServer} from "@/utils/getAuthToken";

const groupMethodSchema = z.object({
    formId: z.number(),
    groupsId: z.array(z.number()).nonempty(),
});

type GroupMethodPayload = z.infer<typeof groupMethodSchema>;

export async function POST(req: Request) {
    try {
        const body: GroupMethodPayload = await req.json();

        const token =req.headers.get('Authorization')
        if (!token) {
            return NextResponse.json(
                {error: 'توکن احراز هویت یافت نشد.'},
                {status: 401}
            );
        }

        const parsed = groupMethodSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                {error: 'خطای اعتبارسنجی', details: parsed.error.errors},
                {status: 400},
            );
        }

        const {data} = await AxiosApi.post('/form-publish-setting/group-method', body,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        return NextResponse.json(data);
    } catch (error: any) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                {error: 'خطای اعتبارسنجی', details: error.errors},
                {status: 400},
            );
        }

        if (error instanceof AxiosError) {
            const status = error.response?.status || 500;
            const data = error.response?.data;

            let message = 'خطایی رخ داده است.';

            if (Array.isArray(data?.message) && data.message[0]?.title) {
                message = data.message[0].title;
            } else if (typeof data?.message === 'string') {
                message = data.message;
            } else if (typeof data?.error === 'string') {
                message = data.error;
            } else if (error.message) {
                message = error.message;
            }

            return NextResponse.json({error: message}, {status});
        }

        return NextResponse.json(
            {error: error?.message || 'خطای ناشناخته'},
            {status: 500},
        );
    }
}