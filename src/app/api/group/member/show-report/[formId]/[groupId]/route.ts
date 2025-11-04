import { z } from 'zod';
import { handleApiProxy, handleGetRequest } from '../../../../../helper';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const showReportSchema = z.object({
  showReportForResponder: z.boolean(),
});

export async function GET(
  req: Request,
  { params }: { params: { formId: string; groupId: string } }
) {
  const formId = Number(params.formId);
  const groupId = Number(params.groupId);
  const endpoint = `/psya/form-publish-setting/find-group-config/${formId}/${groupId}`
  return handleGetRequest(req, endpoint);
}

export async function PUT(
  req: Request,
  { params }: { params: { formId: string; groupId: string } }
) {
  const formId = Number(params.formId);
  const groupId = Number(params.groupId);
  
  return handleApiProxy(req, {
    schema: showReportSchema,
    endpoint: `/psya/form-publish-setting/update-group-config/${formId}/${groupId}`,
    method : "PUT"
  });
}