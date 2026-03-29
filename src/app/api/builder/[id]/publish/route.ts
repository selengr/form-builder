import z from 'zod';
import { handleApiProxy } from '../../../helper';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;


const publishSchema = z.object({
  IsSurvey: z.boolean(),
  IsDataCollection: z.boolean(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const formId = params.id

  const body = await req.json()
  const { IsSurvey, IsDataCollection } = publishSchema.parse(body)
  let url = ''
  if(IsSurvey){
    url = `/admin/form/survey/finalization/${formId}`
  }else if(IsDataCollection){
    url = `/admin/form/data-colleection/finalization/${formId}`
  } else {
     url = `/form/ready-to-publish/${formId}`
  }
  const endpoint = url

  const newReq = new Request(req.url, {
    method: "PUT",
    headers: req.headers,
  })

  return handleApiProxy(newReq, {
    endpoint: `/psya${endpoint}`,
    method: "PUT",
  })
}


