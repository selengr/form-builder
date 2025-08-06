import { handleGetRequest } from '../../../helper';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  const endpoint = `/psya/report/solo/main-list/excel-export/check/${id}`;
  return handleGetRequest(req, endpoint);
}
