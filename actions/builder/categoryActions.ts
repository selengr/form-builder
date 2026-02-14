'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

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

    const response = await AxiosApi.get(url);

    if (!response?.data) {
      throw new Error('خطا در دریافت اطلاعات');
    }

    return response.data;
  } catch (error) {
    console.error('Server Action Error:', error);
    throw new Error('خطا در دریافت اطلاعات');
  }
}
