import { handleGetRequest } from '@/app/api/helper';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(req: Request, { params }: { params: { groupId: string } }) {
    const endpoint = `/psya/user-group/introducer/group-listgrid/${params.groupId}/members`;
    return handleGetRequest(req, endpoint);
}