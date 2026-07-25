import EditPackagingRequestPageContent from '@/templates/user-packaging-request/edit/EditPackagingRequestPageContent';

export const dynamic = 'force-dynamic';

interface UserPackagingRequestEditPageProps {
  params: {
    id: string;
  };
}

export default function UserPackagingRequestEditPage({
  params,
}: UserPackagingRequestEditPageProps) {
  const requestId = Number(params.id);

  return <EditPackagingRequestPageContent requestId={requestId} />;
}
