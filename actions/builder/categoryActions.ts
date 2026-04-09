'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function fetchParentCategory() {
  try {
    const customComboFilterModel = {
      type: 'COMBO',
      entity: 'PROJECTS',
      input: '',
      page: 0,
      rows: 1000,
    };

    const baseUrl = `/category/parent`;
    const queryString = `?customComboFilterModel=${encodeURIComponent(
      JSON.stringify(customComboFilterModel)
    )}`;

    const url = baseUrl + queryString;

    const response = await serverApi.get(url);

    if (!response?.data) {
      throw new Error('خطا در دریافت اطلاعات');
    }

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
