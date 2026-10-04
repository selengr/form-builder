import FormulaDetailView from '@/templates/data-collection/formulas/detail/FormulaDetailView';

export default async function FormulaDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string }>;
}) {
  const { id } = await params;
  const { name } = await searchParams;

  return <FormulaDetailView majorId={id} majorName={name ?? ''} />;
}
