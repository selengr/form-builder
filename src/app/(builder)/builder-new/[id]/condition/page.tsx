import { redirect } from 'next/navigation';

function buildQueryString(query: Record<string, string | string[] | undefined>) {
  return new URLSearchParams(
    Object.entries(query).flatMap(([key, value]) =>
      value === undefined
        ? []
        : Array.isArray(value)
          ? value.map((v) => [key, v])
          : [[key, value]],
    ),
  ).toString();
}

export default async function BuilderNewConditionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const queryString = buildQueryString(await searchParams);
  redirect(queryString ? `/builder-new/${id}?${queryString}` : `/builder-new/${id}`);
}
