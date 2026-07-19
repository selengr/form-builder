import ViewPackagingRequestPageContent from '@/templates/user-packaging-request/view/ViewPackagingRequestPageContent';

export const dynamic = 'force-dynamic';

interface UserPackagingRequestViewPageProps {
  params: {
    id: string;
  };
}

export default function UserPackagingRequestViewPage({
  params,
}: UserPackagingRequestViewPageProps) {
  const requestId = Number(params.id);

  return <ViewPackagingRequestPageContent requestId={requestId} />;
}
