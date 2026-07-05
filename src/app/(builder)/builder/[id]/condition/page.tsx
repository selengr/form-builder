import { redirect } from 'next/navigation';

export default async function ConditionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const queryString = new URLSearchParams(
    Object.entries(query).flatMap(([key, value]) =>
      value === undefined ? [] : Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]],
    ),
  ).toString();

  redirect(queryString ? `/builder/${id}?${queryString}` : `/builder/${id}`);
}
