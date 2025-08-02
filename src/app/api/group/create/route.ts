import { z } from 'zod';
import { handleApiProxy } from '../../helper';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const addByExcelSchema = z.object({
    uuid: z.string(),
    groupName: z.string(),
    groupId: z.string().nullable().optional(),
});

export async function POST(req: Request) {
    return handleApiProxy(req, {
        schema: addByExcelSchema,
        endpoint: '/psya/user-group/member/add-by-excel',
    });
}