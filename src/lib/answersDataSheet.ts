import { api, type ActionResult } from '@/services/axios/actionWapper';

export interface SheetAnswerCell {
  questionId: string | number;
  questionTitle?: string;
  answer?: string;
  [key: string]: unknown;
}

export interface SheetRow {
  row: SheetAnswerCell[];
  [key: string]: unknown;
}

interface AnswersDataSheetResponse {
  content: SheetRow[];
  totalElements?: number;
}

export interface AnswersDataSheet {
  headData: SheetAnswerCell[];
  allData: SheetRow[];
  totalItems: number;
}

const ALL_ROWS = 100000;

export async function fetchAnswersDataSheet(
  baseUrl: string,
  id: string,
  page: number,
  pageSize: number,
): Promise<ActionResult<AnswersDataSheet>> {
  const rows = pageSize === -1 ? ALL_ROWS : pageSize;
  const pageNumber = pageSize === -1 ? 0 : page - 1;

  const searchFilterModel = {
    searchFilterBoxList: [{ restrictionList: [] }],
    sortList: [{ fieldName: 'id', type: 'DSC' }],
    page: pageNumber,
    rows,
  };

  const response = await api.get<AnswersDataSheetResponse>(
    `${baseUrl}/${id}?searchFilterModel=${encodeURIComponent(JSON.stringify(searchFilterModel))}`,
  );

  if (!response.success) return response;

  const { content, totalElements } = response.data;

  const headData: SheetAnswerCell[] = [
    { questionId: 'index_column_id_row', questionTitle: 'ردیف' },
    ...(content[0]?.row ?? []),
    { questionId: 'actions_column_id_action', questionTitle: 'عملیات' },
  ];

  const startIndex = pageNumber * rows;
  const allData: SheetRow[] = content.map((item, index) => ({
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
    success: true,
    data: {
      headData,
      allData,
      totalItems: totalElements || content.length,
    },
  };
}
