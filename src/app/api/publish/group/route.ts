import { z } from 'zod';
import { handleApiProxy } from '../../helper';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const groupMethodSchema = z.object({
  formId: z.number(),
  groupsId: z.array(z.number()).nonempty(),
  showReportForResponder: z.boolean(),
});

export async function POST(req: Request) {
  return handleApiProxy(req, {
    schema: groupMethodSchema,
    endpoint: '/psya/form-publish-setting/group-method',
  });
}
