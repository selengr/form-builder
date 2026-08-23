import EditPackagingRequestPageContent from '@/templates/user-packaging-request/edit/EditPackagingRequestPageContent';

export const dynamic = 'force-dynamic';

interface UserPackagingRequestEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserPackagingRequestEditPage({
  params,
}: UserPackagingRequestEditPageProps) {
  const { id } = await params;
  const requestId = Number(id);

  return <EditPackagingRequestPageContent requestId={requestId} />;
}
