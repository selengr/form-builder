import FormBuilderWapper from '@/templates/builder/FormBuilderWapper';
import BuilderErrorPage from './BuilderErrorPage';
import { getBuilderBackConfig } from './builderBackConfig';
import { getFormAction } from '@actions/builder/getFormAction';

export default async function BuilderIdPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ admin?: string | string[] }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const admin = Array.isArray(sp.admin) ? sp.admin[0] : sp.admin;
  const response = await getFormAction(id);

  if (!response.success) {
    const back = getBuilderBackConfig(admin);

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
