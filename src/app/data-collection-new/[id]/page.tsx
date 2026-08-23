import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = 'force-dynamic';

export default async function DataCollectionNewDetailRedirect({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const query = await searchParams;
  const name = typeof query.name === 'string' ? query.name : undefined;
  const qs = name ? `?name=${encodeURIComponent(name)}` : '';
  redirect(`/data-collection/${id}${qs}`);
}
