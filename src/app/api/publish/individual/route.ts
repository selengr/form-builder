import { z } from 'zod';
import { handleApiProxy } from '../../helper';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const withGroupIdSchema = z.object({
  formId: z.string(),
  introducedUserJTGroupId: z.number(),
  showReportForResponder: z.boolean(),
});

const withoutGroupIdSchema = z.object({
  formId: z.string(),
  introducedUserJTGroupId: z.null(),
  name: z.string(),
  lname: z.string(),
  username: z.string(),
  gender: z.enum(['MALE', 'FEMALE']),
  showReportForResponder: z.boolean(),
});

const soloMethodSchema = z.union([withGroupIdSchema, withoutGroupIdSchema]);

export async function POST(req: Request) {
  return handleApiProxy(req, {
    schema: soloMethodSchema,
    endpoint: '/psya/form-publish-setting/solo-method',
  });
}
