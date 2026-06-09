import { serverApi } from '@/services/axios/serverApi';
import FormBuilderWapper from '@/templates/builder/FormBuilderWapper';

async function getFormDataAction(id: string) {
  try {
    const response = await serverApi.get(`/form/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.message)
  }
}

export default async function BuilderPage({ params }: { params: { id: string } }) {
  const data = await getFormDataAction(params.id)

  return <FormBuilderWapper data={data} />;
}