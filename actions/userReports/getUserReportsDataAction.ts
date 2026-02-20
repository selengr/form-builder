'use server';

import { AxiosApi } from '@/services/axios/AxiosApi';

export async function getUserReportsDataAction(page: number = 1, pageSize: number = 25) {
  try {
    const rows = pageSize === -1 ? 100000 : pageSize;
    const pageNumber = pageSize === -1 ? 0 : page - 1;

    const response = await AxiosApi.get(
      `/admin/destroy-form/list-report-destroy-form?searchFilterModel=%7B%22searchFilterBoxList%22%3A%5B%7B%22restrictionList%22%3A%5B%5D%7D%5D%2C%22sortList%22%3A%5B%7B%22fieldName%22%3A%22id%22%2C%22type%22%3A%22DSC%22%7D%5D%2C%22page%22%3A${pageNumber}%2C%22rows%22%3A${rows}%7D`,
    );

    const rawData = response.data;

    const headData = [
      { questionTitle: 'ردیف' },
      { questionTitle: 'عنوان فرم' },
      { questionTitle: 'منتشر کننده' },
      { questionTitle: 'تعداد گزارش' },
      { questionTitle: 'وضعیت' },
      { questionTitle: 'مشاهده' },
    ];

    return {
      headData,
      allData: rawData.content,
      totalItems: rawData.totalElements || rawData.content.length,
    };
  } catch (error) {
    console.error('Error in getUserReportsDataAction:', error);
    throw error;
  }
}