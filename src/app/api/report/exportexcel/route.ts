import { z } from 'zod';
import { handleApiProxy } from '../../helper';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const exportExcelSchema = z.object({
    takePartIdList: z.array(z.number()).nonempty("لیست افراد نباید خالی باشد"),
});

export async function POST(req: Request) {
    return handleApiProxy(req, {
        schema: exportExcelSchema,
        endpoint: '/psya/report/solo/main-list/excel-export',
    });
}