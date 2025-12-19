import z from 'zod';
import { handleApiProxy } from '../../../helper';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;


const publishSchema = z.object({
  IsSurvey: z.boolean(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const formId = params.id

  const body = await req.json()
  const { IsSurvey } = publishSchema.parse(body)

  const endpoint = IsSurvey ? `/admin/form/survey/finalization/${formId}` : `/form/ready-to-publish/${formId}`

  const newReq = new Request(req.url, {
    method: "PUT",
    headers: req.headers,
  })

  return handleApiProxy(newReq, {
    endpoint: `/psya${endpoint}`,
    method: "PUT",
  })
}


