import { api } from '@/services/axios/actionWapper';
import FormBuilderWapper from '@/templates/builder/FormBuilderWapper';
import BuilderErrorPage from './error';
import { getBuilderBackConfig } from './builderBackConfig';

async function getFormDataAction(id: string) {
  return api.get(`/form/${id}`);
}

export default async function BuilderPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { admin?: string };
}) {
  const response = await getFormDataAction(params.id);

  if (!response.success) {
    const back = getBuilderBackConfig(searchParams?.admin);

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
