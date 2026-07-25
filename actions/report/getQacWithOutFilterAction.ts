'use server';

import { serverApi } from '@/services/axios/serverApi';

export type GetQacWithOutFilterParams = { formId: string | number };

export async function getQacWithOutFilterAction({ formId }: GetQacWithOutFilterParams) {
  // try {
    const customComboFilterModel = {
      type: 'COMBO',
      entity: 'QUESTIONS',
      mode: 'QUESTIONS_IN_FORM_BUILDER__ALL',
      input: '',
      page: 0,
      rows: 10000,
      extMap: { formId: String(formId), typeRequest: 'QAC_WIHT_OUT_FILTER' },
    };

    const url =
      `/question/q-and-c-custom-combo?customComboFilterModel=` +
      encodeURIComponent(JSON.stringify(customComboFilterModel));

    const res = await serverApi.get(url);
    return res.data;
  // } catch (error: any) {
  //   const message =
  //     error?.response?.data?.message?.[0]?.title ||
  //     error?.response?.data?.message ||
  //     'انجام عملیات با خطا مواجه شد';

  //   throw new Error(message);
  // }
}