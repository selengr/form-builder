import ProcessPackagingRequestPageContent from '@/templates/admin-packaging-request/process/ProcessPackagingRequestPageContent';

export const dynamic = 'force-dynamic';

interface AdminPackagingRequestViewPageProps {
  params: {
    id: string;
  };
}

export default function AdminPackagingRequestViewPage({
  params,
}: AdminPackagingRequestViewPageProps) {
  const requestId = Number(params.id);

  return <ProcessPackagingRequestPageContent requestId={requestId} mode="view" />;
}
