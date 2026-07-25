// import { serverApi } from '@/services/axios/serverApi';
// import CalculatorList from '@/templates/calculator/CalculatorList';
// import { getCalculationListAction } from '@actions/calculator/calculation';

// export const revalidate = 300; 

// async function getFormDataAction(id: string) {
//     const response = await serverApi.get(`/form/${id}`);
//     return response.data;
// }

// export default async function CalculatorPage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params;
//   if (!id) return <div>آیدی نامعتبر است</div>;

//   const formData = await getFormDataAction(id)
//   const data = await getCalculationListAction(id)

//   return (
//     <CalculatorList calculators={data} formData={formData}/>
//   )
// }
import { redirect } from 'next/navigation';

export default async function CalculatorPage({
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
