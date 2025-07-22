import {NextResponse} from 'next/server';
import {AxiosApi} from '@/services/axios/AxiosApi';
import {z, ZodError} from 'zod';
import {AxiosError} from 'axios';
import {getAuthToken} from "@/utils/getAuthToken";

const soloMethodSchema = z.object({
  formId: z.string(),
  name: z.string(),
  lname: z.string(),
  username: z.string(),
  gender: z.enum(['MALE', 'FEMALE']),
  groupId: z.string().nullable(),
});

type SoloMethodPayload = z.infer<typeof soloMethodSchema>;

export async function POST(req: Request) {
  try {
    const body: SoloMethodPayload = await req.json();

    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json(
          { error: 'توکن احراز هویت یافت نشد.' },
          { status: 401 }
      );
    }

    const parsed = soloMethodSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {error: 'خطای اعتبارسنجی', details: parsed.error.errors},
        {status: 400},
      );
    }

    const {data} = await AxiosApi.post('/form-publish-setting/solo-method', body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    );
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