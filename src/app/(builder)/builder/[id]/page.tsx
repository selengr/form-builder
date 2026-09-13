import { api } from '@/services/axios/actionWapper';
import FormBuilderWapper from '@/templates/builder/FormBuilderWapper';
import BuilderErrorPage from './BuilderErrorPage';
import { getBuilderBackConfig } from './builderBackConfig';

async function getFormDataAction(id: string) {
  return api.get(`/form/${id}`);
}

export default async function BuilderIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getFormDataAction(id);

  if (!response.success) {
    const back = getBuilderBackConfig('builder');

    return (
      <BuilderErrorPage
        message={response.message}
        backHref={back.href}
        backLabel={back.label}
      />
    );
  }

  return <FormBuilderWapper data={response.data} />;
}
