import { z } from 'zod';
import { handleApiProxy } from '../helper';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const schema = z.object({
  name: z.string().min(2).max(50),
  targetPlatformEnum: z.string().min(1),
  label: z.string().min(8).max(30),
});

export async function POST(req: Request) {
  const endpoint = `/psya/admin/form/data-collection`;
  return handleApiProxy(req, { schema: schema, endpoint: endpoint });
}