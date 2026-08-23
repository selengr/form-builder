import ViewPackagingRequestPageContent from '@/templates/user-packaging-request/view/ViewPackagingRequestPageContent';

export const dynamic = 'force-dynamic';

interface UserPackagingRequestViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserPackagingRequestViewPage({
  params,
}: UserPackagingRequestViewPageProps) {
  const { id } = await params;
  const requestId = Number(id);

  return <ViewPackagingRequestPageContent requestId={requestId} />;
}
