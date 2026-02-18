'use server';

import { getAuthToken } from '@/utils/getAuthToken';

const API_BASE = '/api/builder';

export async function getOnlyAllCalcAction(formId: string | string[]) {
  const token = await getAuthToken();

  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'QUESTIONS',
    mode: 'QUESTIONS_IN_FORM_BUILDER__ALL',
    input: '',
    page: 0,
    rows: 10000,
    extMap: {
      formId,
      typeRequest: 'ONLY_ALL_CALC',
    },
  };

  const queryString = `?customComboFilterModel=${encodeURIComponent(
    JSON.stringify(customComboFilterModel),
  )}`;

  const res = await fetch(`${API_BASE}/question/q-and-c-custom-combo${queryString}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ONLY_ALL_CALC (${res.status})`);
  }

  return res.json();
}