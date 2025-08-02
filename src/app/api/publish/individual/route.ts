import { z } from 'zod';
import {handleApiProxy} from "../../helper";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const soloMethodSchema = z.object({
    formId: z.string(),
    name: z.string(),
    lname: z.string(),
    username: z.string(),
    gender: z.enum(['MALE', 'FEMALE']),
    groupId: z.string().nullable(),
});

export async function POST(req: Request) {
    return handleApiProxy(req, {
        schema: soloMethodSchema,
        endpoint: '/psya/form-publish-setting/solo-method',
    });
}