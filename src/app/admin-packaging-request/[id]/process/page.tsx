import ProcessPackagingRequestPageContent from '@/templates/admin-packaging-request/process/ProcessPackagingRequestPageContent';

export const dynamic = 'force-dynamic';

interface AdminPackagingRequestProcessPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminPackagingRequestProcessPage({
  params,
}: AdminPackagingRequestProcessPageProps) {
  const { id } = await params;
  const requestId = Number(id);

  return <ProcessPackagingRequestPageContent requestId={requestId} />;
}
