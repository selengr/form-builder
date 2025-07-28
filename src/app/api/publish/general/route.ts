import {NextResponse} from 'next/server';
import {AxiosApi} from '@/services/axios/AxiosApi';
import {z, ZodError} from 'zod';
import {AxiosError} from 'axios';
import {getAuthTokenServer} from "@/utils/getAuthToken";

const publicMethodSchema = z.object({
    formId: z.union([z.string(), z.number()]),
    publicationMainPageMethod: z.boolean(),
    capacityPublicLink: z.number().min(0),
});

type PublicMethodPayload = z.infer<typeof publicMethodSchema>;

export async function POST(req: Request) {
    try {
        const token =req.headers.get('Authorization')
        if (!token) {
            return NextResponse.json({error: 'توکن احراز هویت یافت نشد.'}, {status: 401});
        }

        const body: unknown = await req.json();
        const parsed = publicMethodSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({error: 'خطای اعتبارسنجی', details: parsed.error.errors}, {status: 400});
        }
        console.log("data",parsed.data)
        console.log("token",token)
        const {data} = await AxiosApi.post('/form-publish-setting/public-method', parsed.data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return NextResponse.json(data);
    } catch (error: any) {
        if (error instanceof ZodError) {
            return NextResponse.json({error: 'خطای اعتبارسنجی', details: error.errors}, {status: 400});
        }

        if (error instanceof AxiosError) {
            const status = error.response?.status || 500;
            const data = error.response?.data;
            let message = 'خطایی رخ داده است.';

            if (typeof data?.message === 'string') {
                message = data.message;
            } else if (Array.isArray(data?.message) && data.message[0]?.title) {
                message = data.message[0].title;
            } else if (typeof data?.error === 'string') {
                message = data.error;
            } else if (error.message) {
                message = error.message;
            }

            return NextResponse.json({error: message}, {status});
        }

        return NextResponse.json({error: error?.message || 'خطای ناشناخته'}, {status: 500});
    }
}