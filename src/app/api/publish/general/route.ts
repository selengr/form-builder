import { z } from 'zod';
import { handleApiProxy } from '../../helper';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const publicMethodSchema = z.object({
  formId: z.union([z.string(), z.number()]),
  publicationMainPageMethod: z.boolean(),
  capacityPublicLink: z.number().min(0),
});

export async function POST(req: Request) {
  return handleApiProxy(req, {
    schema: publicMethodSchema,
    endpoint: '/psya/form-publish-setting/public-method',
  });
}
