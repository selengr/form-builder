import FormBuilderWapper from '@/templates/builder/FormBuilderWapper';
import { getFormDataAction } from '../../../../../actions/builder/getForm';

export const revalidate = 300; 

export default async function BuilderPage({ params }: { params: { id: string } }) {
 const data = await getFormDataAction(params.id)

  return <FormBuilderWapper data={data} />;
}

