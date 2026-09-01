'use server';

import { api } from '@/services/axios/actionWapper';

type UserReportsListResponse = {
  content: unknown[];
  totalElements?: number;
};

export async function getUserReportsDataAction(page: number = 1, pageSize: number = 25) {
  const rows = pageSize === -1 ? 100000 : pageSize;
  const pageNumber = pageSize === -1 ? 0 : page - 1;

  const searchFilterModel = {
    searchFilterBoxList: [{ restrictionList: [] }],
    sortList: [{ fieldName: 'id', type: 'DSC' }],
    page: pageNumber,
    rows,
  };

  const url =
    `/admin/destroy-form/list-report-destroy-form?searchFilterModel=` +
    encodeURIComponent(JSON.stringify(searchFilterModel));

  const result = await api.get<UserReportsListResponse>(url);

  if (!result.success) {
    return {
      success: false as const,
      message: result.message,
    };
  }

  const rawData = result.data;

  const headData = [
    { questionTitle: 'ردیف' },
    { questionTitle: 'عنوان فرم' },
    { questionTitle: 'منتشر کننده' },
    { questionTitle: 'تعداد گزارش' },
    { questionTitle: 'وضعیت' },
    { questionTitle: 'مشاهده' },
  ];

  return {
    success: true as const,
    headData,
    allData: rawData.content,
    totalItems: rawData.totalElements || rawData.content.length,
  };
}
