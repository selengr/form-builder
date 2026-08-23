import ProcessPackagingRequestPageContent from '@/templates/admin-packaging-request/process/ProcessPackagingRequestPageContent';

export const dynamic = 'force-dynamic';

interface AdminPackagingRequestViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminPackagingRequestViewPage({
  params,
}: AdminPackagingRequestViewPageProps) {
  const { id } = await params;
  const requestId = Number(id);

  return <ProcessPackagingRequestPageContent requestId={requestId} mode="view" />;
}
