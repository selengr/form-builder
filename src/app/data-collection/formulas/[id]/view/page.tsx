import FormulaViewDetail from '@/templates/data-collection/formulas/view/FormulaViewDetail';

export default async function FormulaViewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string }>;
}) {
  const { id } = await params;
  const { name } = await searchParams;

  return <FormulaViewDetail majorId={id} majorName={name ?? ''} />;
}
