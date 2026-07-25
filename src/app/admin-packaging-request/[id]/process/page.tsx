import ProcessPackagingRequestPageContent from '@/templates/admin-packaging-request/process/ProcessPackagingRequestPageContent';

export const dynamic = 'force-dynamic';

interface AdminPackagingRequestProcessPageProps {
  params: {
    id: string;
  };
}

export default function AdminPackagingRequestProcessPage({
  params,
}: AdminPackagingRequestProcessPageProps) {
  const requestId = Number(params.id);

  return <ProcessPackagingRequestPageContent requestId={requestId} />;
}
