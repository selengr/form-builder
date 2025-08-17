import { destroyReportSchema } from '@/validators/destroyReportSchema';
import { handleApiProxy, handleGetRequest } from '../helper';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(req: Request) {
  const endpoint = '/psya/user/report-destroy-form/response-destroy';
  return handleGetRequest(req, endpoint, false);
}

export async function POST(req: Request) {
  const endpoint = '/psya/user/report-destroy-form';

  return handleApiProxy(req, {schema: destroyReportSchema, endpoint: endpoint, requiresAuth: false});
}
