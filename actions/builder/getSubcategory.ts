'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

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

  const baseUrl = `/category/subcategory`;
  const queryString =
    `?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}` +
    `&subcategoryModel=${encodeURIComponent(JSON.stringify(subcategoryModel))}`;

  const url = baseUrl + queryString;

  const response = await AxiosApi.get(url);
  return response.data;
}