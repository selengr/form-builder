'use server';

import { api } from '@/services/axios/actionWapper';

export async function getUserPackagingRequestParentCategoryAction() {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'PROJECTS',
    input: '',
    page: 0,
    rows: 1000,
  };

  const url =
    `/category/parent?customComboFilterModel=${encodeURIComponent(
      JSON.stringify(customComboFilterModel),
    )}`;

  return api.get(url);
}
