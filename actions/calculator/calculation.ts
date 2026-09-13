'use server';

import { api } from '@/services/axios/actionWapper';

export async function createCalculationAction(payload: {
  name: string;
  formBuilderId: any;
  label: string | null;
  theFormula: string;
  frontCalcData: string;
}) {
  return api.post('/calculation', payload);
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
  return api.put(`/calculation/${calcId}`, payload);
}

export async function checkCalculationDependencyAction(id: number) {
  return api.get(`/calculation/check-dependency/${id}`);
}

export async function deleteCalculatorAction(id: number) {
  return api.delete(`/calculation/delete/${id}`);
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

  const result = await api.get<{ content: unknown[] }>(url);

  if (!result.success) {
    return { success: false as const, message: result.message };
  }

  return {
    success: true as const,
    data: result.data.content,
  };
}
