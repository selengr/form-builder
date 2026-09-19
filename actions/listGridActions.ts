'use server';

import { api } from '@/services/axios/actionWapper';

interface SearchBoxItem {
  fieldName: string;
  fieldOperation: 'MATCH' | 'EQUAL' | 'DSC' | 'ASC' | 'IN';
  fieldValue: string | string[];
  nextConditionOperator: 'OR' | 'AND';
}

export interface SearchQueryFilter {
  type: string;
  status: string;
  isCreatedSoloReport: string;
  fieldOperation: 'DSC' | 'ASC' | string;
}

const PAGE_SIZE = 10;

const DEFAULT_SEARCH_FILTER: SearchQueryFilter = {
  type: 'ALL',
  status: 'PUBLIC',
  isCreatedSoloReport: 'ALL',
  fieldOperation: 'DSC',
};

function buildFilterRestrictions(filter: SearchQueryFilter): SearchBoxItem[] {
  const mapping: Array<{
    key: keyof SearchQueryFilter;
    fieldName: string;
  }> = [
    { key: 'type', fieldName: 'typeEnum' },
    { key: 'status', fieldName: 'status' },
    { key: 'isCreatedSoloReport', fieldName: 'isCreatedSoloReport.filter' },
  ];

  return mapping
    .filter(({ key }) => filter[key] && filter[key] !== 'ALL')
    .map(({ key, fieldName }) => ({
      fieldName,
      fieldOperation: 'EQUAL' as const,
      fieldValue: filter[key],
      nextConditionOperator: 'AND' as const,
    }));
}

function isValidRestriction(item?: SearchBoxItem) {
  if (!item) return false;

  if (typeof item.fieldValue === 'string') {
    return item.fieldValue.trim() !== '';
  }

  if (Array.isArray(item.fieldValue)) {
    return item.fieldValue.length > 0;
  }

  return true;
}

export async function fetchListGridData(
  { pageParam = 0 }: { pageParam: number },
  searchBoxList: SearchBoxItem[],
  filterBoxList: SearchBoxItem[],
  url: string,
  searchQueryFilter: SearchQueryFilter = DEFAULT_SEARCH_FILTER,
) {
  const filterRestrictions = buildFilterRestrictions(searchQueryFilter);

  const restrictionList = [
    ...searchBoxList,
    ...filterBoxList,
    ...filterRestrictions,
  ].filter(isValidRestriction);

  const params = {
    searchFilterBoxList: [{ restrictionList }],
    sortList: [
      {
        fieldName: 'id',
        type: searchQueryFilter.fieldOperation,
      },
    ],
    page: pageParam,
    rows: PAGE_SIZE,
  };

  const encodedParams = encodeURIComponent(JSON.stringify(params));
  const fullURL = `${url}?searchFilterModel=${encodedParams}`;

  const res = await api.get<{ content: unknown[]; totalElements: number }>(fullURL);

  if (!res.success) {
    return {
      success: false as const,
      message: res.message,
    };
  }

  return {
    success: true as const,
    data: res.data.content,
    total: res.data.totalElements,
  };
}
