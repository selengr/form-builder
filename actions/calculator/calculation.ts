// only ssr
// this is not server action
'use server' // temprarly
import { serverApi } from '@/services/axios/serverApi';

export async function createCalculationAction(payload: {
  name: string;
  formBuilderId: any;
  label: string | null;
  theFormula: string;
  frontCalcData: string;
}) {
  const res = await serverApi.post('/calculation', payload as any);
  return res.data;
}

export async function updateCalculationAction(
  calcId: number,
  payload: {
    id: number;
    name: string;
    label: string | null;
    formBuilderId: any;
    theFormula: string;
    frontCalcData: string;
  },
) {
  const res = await serverApi.put(`/calculation/${calcId}`, payload as any);
  return res.data;
}

export async function checkCalculationDependencyAction(id: number) {
  const res = await serverApi.get(`/calculation/check-dependency/${id}`);
  return res.data;
}

export async function deleteCalculatorAction(id: number) {
  const res = await serverApi.delete(`/calculation/delete/${id}`);
  return res.data;
}

export async function getCalculationListAction(id: string) {
  const filterModel = {
    searchFilterBoxList: [{ restrictionList: [] }],
    sortList: [{ fieldName: 'id', type: 'DSC' }],
    page: 0,
    rows: 1000,
  };

  const url =
    `/calculation/main-list/${id}` +
    `?searchFilterModel=${encodeURIComponent(JSON.stringify(filterModel))}`;

  const res = await serverApi.get(url);
  return res.data.content;
}