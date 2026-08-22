'use server';

import { api } from '@/services/axios/actionWapper';

export async function getStatsDataAction(
  id: string,
  page: number = 1,
  pageSize: number = 25
) {
  const rows = pageSize === -1 ? 100000 : pageSize;
  const pageNumber = pageSize === -1 ? 0 : page - 1;

  const response = await api.get(
    `/admin/form/data-collection/answers-data-sheet/${id}?searchFilterModel=%7B%22searchFilterBoxList%22%3A%5B%7B%22restrictionList%22%3A%5B%5D%7D%5D%2C%22sortList%22%3A%5B%7B%22fieldName%22%3A%22id%22%2C%22type%22%3A%22DSC%22%7D%5D%2C%22page%22%3A${pageNumber}%2C%22rows%22%3A${rows}%7D`
  );

  if (!response.success) return response;

  const rawData = response.data;

  const headRow = rawData.content[0]?.row ?? [];
  const headData = [
    { questionId: 'index_column_id_row', questionTitle: 'ردیف' },
    ...headRow,
    { questionId: 'actions_column_id_action', questionTitle: 'عملیات' },
  ];

  const startIndex = pageNumber * rows;
  const dataWithIndex = rawData.content.map((item: any, index: number) => ({
    ...item,
    row: [
      {
        answer: (startIndex + index + 1).toString(),
        questionId: 'index_column_id',
      },
      ...item.row,
    ],
  }));

  return {
    success: true as const,
    data: {
      headData,
      allData: dataWithIndex,
      totalItems: rawData.totalElements || rawData.content.length,
    },
  };
}
