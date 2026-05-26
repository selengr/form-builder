import { serverApi } from '@/services/axios/serverApi';
import FormBuilderWapper from '@/templates/builder/FormBuilderWapper';

export async function getFormDataAction(id: string) {
    const response = await serverApi.get(`/form/${id}`);
    return response.data;
}

export default async function BuilderPage({ params }: { params: { id: string } }) {
 const data = await getFormDataAction(params.id)

  return <FormBuilderWapper data={data} />;
}