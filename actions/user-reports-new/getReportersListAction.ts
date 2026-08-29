'use server';

import { api } from '@/services/axios/actionWapper';

interface SearchBoxItem {
  fieldName: 'typeOfReport' | 'responseForDestroyerReport' | string;
  fieldOperation: 'MATCH' | 'EQUAL' | 'DSC' | 'ASC' | 'IN';
  fieldValue: string | string[];
  nextConditionOperator: 'OR' | 'AND';
}

export interface ReportersSearchQueryFilter {
  responseForDestroyerReport: string;
  typeOfReport: string;
  fieldOperation: string;
}

export interface GetReportersListParams {
  pageParam: number;
  searchBoxList: SearchBoxItem[];
  filterBoxList: SearchBoxItem[];
  url: string;
  searchQueryFilter: ReportersSearchQueryFilter;
}

const PAGE_SIZE = 10;

function isValidRestriction(item?: SearchBoxItem) {
  if (!item) return false;

  if (typeof item.fieldValue === 'string') {
    return item.fieldValue !== '';
  }

  if (Array.isArray(item.fieldValue)) {
    return item.fieldValue.length > 0;
  }

  return true;
}

export async function getReportersListAction({
  pageParam,
  searchBoxList,
  filterBoxList,
  url,
  searchQueryFilter,
}: GetReportersListParams) {
  const filterRestrictions: SearchBoxItem[] = [];

  if (
    searchQueryFilter.responseForDestroyerReport &&
    searchQueryFilter.responseForDestroyerReport !== 'ALL'
  ) {
    filterRestrictions.push({
      fieldName: 'responseForDestroyerReport',
      fieldOperation: 'EQUAL',
      fieldValue: searchQueryFilter.responseForDestroyerReport,
      nextConditionOperator: 'AND',
    });
  }

  if (searchQueryFilter.typeOfReport && searchQueryFilter.typeOfReport !== 'ALL') {
    filterRestrictions.push({
      fieldName: 'typeOfReport',
      fieldOperation: 'EQUAL',
      fieldValue: searchQueryFilter.typeOfReport,
      nextConditionOperator: 'AND',
    });
  }

  const restrictionList = [...searchBoxList, ...filterBoxList, ...filterRestrictions].filter(
    isValidRestriction,
  );

  const params = {
    searchFilterBoxList: [{ restrictionList }],
    sortList: [{ fieldName: 'id', type: searchQueryFilter.fieldOperation }],
    page: pageParam,
    rows: PAGE_SIZE,
  };

  const endpoint = `${url}?searchFilterModel=${encodeURIComponent(JSON.stringify(params))}`;
  const result = await api.get<any>(endpoint);

  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch data');
  }

  return {
    data: result.data ?? null,
    publicationApprovalByAdmin: result.data?.publicationApprovalByAdmin ?? null,
  };
}
