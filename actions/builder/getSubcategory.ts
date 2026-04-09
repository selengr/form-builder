'use server';

import { serverApi } from '@/services/axios/serverApi';

interface SubcategoryModel {
  parentId: string[];
}

export async function getSubcategoryAction(parentId: string[]) {
   try {
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

  const response = await serverApi.get(url);
  return response.data;

} catch (error: any) {
  const message =
    error?.response?.data?.message?.[0]?.title ||
    error?.response?.data?.message ||
    error?.response?.data ||
    error?.message ||
    'خطای نامشخص';

  throw new Error(message);
}
}