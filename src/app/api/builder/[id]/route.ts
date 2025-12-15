import { handleGetRequest } from '../../helper';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const endpoint = `/psya/form/${(await params).id}`;
  return handleGetRequest(req, endpoint);
}