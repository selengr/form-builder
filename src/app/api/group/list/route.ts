import { handleGetRequest } from '../../helper';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(req: Request) {
    const endpoint = '/psya/user-group/introducer/group-listgrid';
    return handleGetRequest(req, endpoint);
}