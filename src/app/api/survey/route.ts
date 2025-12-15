import { z } from 'zod';
import { handleApiProxy } from '../helper';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const schema = z.object({
  name: z.string().min(2).max(50),
  surveyTargetPlatformEnum: z.string().min(1),
  surveyPurposeEnum: z.string().min(1),
});

export async function POST(req: Request) {
  const endpoint = `/psya/admin/form/survey`;
  return handleApiProxy(req, { schema: schema, endpoint: endpoint });
}