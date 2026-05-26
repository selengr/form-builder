import FormBuilderWapper from '@/templates/builder/FormBuilderWapper';
import { serverApi } from '@/services/axios/serverApi';
// import { getFormDataAction } from '../../../../../actions/builder/getForm';




export async function getFormDataAction(id: string) {
    // await new Promise((resolve)=> setTimeout(() => resolve, 500))
    const response = await serverApi.get(`/form/${id}`);
    return response.data;
}

export default async function BuilderPage({ params }: { params: { id: string } }) {
 const data = await getFormDataAction(params.id)

  return <FormBuilderWapper data={data} />;
}

