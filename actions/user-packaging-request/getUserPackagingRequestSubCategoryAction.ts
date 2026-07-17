'use server';

import { api } from '@/services/axios/actionWapper';

export async function getUserPackagingRequestSubCategoryAction(parentId: string[]) {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'PROJECTS',
    input: '',
    page: 0,
    rows: 1000,
  };

  const subcategoryModel = { parentId };

  const url =
    `/category/subcategory?customComboFilterModel=${encodeURIComponent(
      JSON.stringify(customComboFilterModel),
    )}&subcategoryModel=${encodeURIComponent(JSON.stringify(subcategoryModel))}`;

  return api.get(url);
}
