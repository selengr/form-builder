'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export async function createCalculationAction(payload: {
  name: string;
  formBuilderId: any;
  label: string | null;
  theFormula: string;
  frontCalcData: string;
}) {
  const res = await AxiosApi.post('/calculation', payload as any);
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
  const res = await AxiosApi.put(`/calculation/${calcId}`, payload as any);
  return res.data;
}