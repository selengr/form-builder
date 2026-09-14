import { handleGetRequest } from '@/app/api/helper';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ groupId: string }> },
) {
  const { groupId } = await params;
  const endpoint = `/psya/user-group/introducer/group-listgrid/${groupId}/members`;
  return handleGetRequest(req, endpoint);
}
