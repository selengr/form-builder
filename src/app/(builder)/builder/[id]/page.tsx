import { api } from '@/services/axios/actionWapper';
import { serverApi } from '@/services/axios/serverApi';
import FormBuilderWapper from '@/templates/builder/FormBuilderWapper';
import BuilderErrorPage from './error';

async function getFormDataAction(id: string) {
    return await api.get(`/form/${id}`);
}

export default async function BuilderPage({ params }: { params: { id: string } }) {
  const response = await getFormDataAction(params.id)

  if(!response.success){
    return <BuilderErrorPage error={response as any} />
  }

  return <FormBuilderWapper data={response.data} />;
}