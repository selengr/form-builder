import { api } from '@/services/axios/actionWapper';
import FormBuilderWapper from '@/templates/builder/FormBuilderWapper';
import BuilderErrorPage from '@/app/(builder)/builder/[id]/error';
import { getBuilderBackConfig } from '@/app/(builder)/builder/[id]/builderBackConfig';

async function getFormDataAction(id: string) {
  return api.get(`/form/${id}`);
}

export default async function BuilderNewIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getFormDataAction(id);

  if (!response.success) {
    const back = getBuilderBackConfig('builder-new');

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
