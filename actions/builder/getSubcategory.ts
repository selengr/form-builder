'use server';

import { api } from '@/services/axios/actionWapper';

interface SubcategoryModel {
  parentId: string[];
}

export async function getSubcategoryAction(parentId: string[]) {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'PROJECTS',
    input: '',
    page: 0,
    rows: 1000,
  };

  const subcategoryModel: SubcategoryModel = { parentId };

  const url =
    `/category/subcategory` +
    `?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}` +
    `&subcategoryModel=${encodeURIComponent(JSON.stringify(subcategoryModel))}`;

  return api.get(url);
}
