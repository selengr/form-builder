export interface MyAssessmentsListItem {
  id: string | number;
  [key: string]: unknown;
}

export const MY_ASSESSMENTS_LIST_QUERY_KEY = 'my_assessments_list';

export const DEFAULT_MY_ASSESSMENTS_FILTER = {
  type: 'ALL',
  status: 'ALL',
  takeParts: 'ALL',
  showReport: 'ALL',
};
