import { getReportersListAction } from '@actions/user-reports-new/getReportersListAction';

interface SearchBoxItem {
  fieldName: 'typeOfReport' | 'responseForDestroyerReport';
  fieldOperation: 'MATCH' | 'EQUAL' | 'DSC' | 'ASC' | 'IN';
  fieldValue: string | string[];
  nextConditionOperator: 'OR' | 'AND';
}

const DEFAULT_SEARCH_FILTER = {
  responseForDestroyerReport: 'ALL',
  typeOfReport: 'ALL',
  fieldOperation: 'DSC',
};

export async function fetchData(
  {
    pageParam = 0,
  }: {
    pageParam: number;
  },
  searchBoxList: SearchBoxItem[],
  filterBoxList: SearchBoxItem[],
  url: string,
  searchQueryFilter = DEFAULT_SEARCH_FILTER,
) {
  return getReportersListAction({
    pageParam,
    searchBoxList,
    filterBoxList,
    url,
    searchQueryFilter,
  });
}
