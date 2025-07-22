import { NextResponse } from 'next/server';
import { AxiosApi } from '@/services/axios/AxiosApi';
import { AxiosError } from 'axios';
import { z, ZodError } from 'zod';
import { getAuthToken } from '@/utils/getAuthToken';

const exportExcelSchema = z.object({
  takePartIdList: z.array(z.number()).nonempty("لیست افراد نباید خالی باشد"),
});

type ExportExcelPayload = z.infer<typeof exportExcelSchema>;

export async function POST(req: Request) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json(
        { error: 'توکن احراز هویت یافت نشد.' },
        { status: 401 }
      );
    }

    const body: ExportExcelPayload = await req.json();
    const parsed = exportExcelSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'خطای اعتبارسنجی', details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { data } = await AxiosApi.post(
      '/report/solo/main-list/excel-export',
      parsed.data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'خطای اعتبارسنجی', details: error.errors },
        { status: 400 }
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

      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(
    // @ts-ignore
      { error: error?.message || 'خطای ناشناخته' },
      { status: 500 }
    );
  }
}