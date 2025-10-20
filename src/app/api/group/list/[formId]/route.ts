import { handleGetRequest } from '@/app/api/helper';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(req: Request, { params }: { params: { formId: string } }) {
    const { searchParams } = new URL(req.url);
    const formId = params.formId;
    const searchFilterModel = searchParams.get('searchFilterModel');
    const groupId = searchParams.get('groupId');

    const endpoint = `/psya/user-group/introducer/group-listgrid/${Number(groupId)}/members?searchFilterModel=${searchFilterModel}&formId=${Number(formId)}`;

    return handleGetRequest(req, endpoint);
}
