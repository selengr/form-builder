'use server';

import { api } from '@/services/axios/actionWapper';

const PAGE_SIZE = 10;
const LIST_URL = '/public-page/form/main-list';

interface SearchBoxItem {
  fieldName: string;
  fieldOperation: 'MATCH' | 'EQUAL' | 'DSC' | 'ASC' | 'IN';
  fieldValue: string | string[];
  nextConditionOperator: 'OR' | 'AND';
}

export interface PublicFormSearchQueryFilter {
  type: string;
  status: string;
  isCreatedSoloReport: string;
  fieldOperation: string;
}

export interface GetPublicFormListParams {
  pageParam: number;
  searchBoxList: SearchBoxItem[];
  filterBoxList: SearchBoxItem[];
  searchQueryFilter: PublicFormSearchQueryFilter;
  pageSize?: number;
}

function isValidRestriction(item?: SearchBoxItem) {
  if (!item) return false;
  if (typeof item.fieldValue === 'string') return item.fieldValue.trim() !== '';
  if (Array.isArray(item.fieldValue)) return item.fieldValue.length > 0;
  return true;
}

function buildFilterRestrictions(filter: PublicFormSearchQueryFilter): SearchBoxItem[] {
  const mapping: Array<{ key: keyof PublicFormSearchQueryFilter; fieldName: string }> = [
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

export async function getPublicFormListAction({
  pageParam,
  searchBoxList,
  filterBoxList,
  searchQueryFilter,
  pageSize = PAGE_SIZE,
}: GetPublicFormListParams) {
  const filterRestrictions = buildFilterRestrictions(searchQueryFilter);

  const restrictionList = [...searchBoxList, ...filterBoxList, ...filterRestrictions].filter(
    isValidRestriction,
  );

  const params = {
    searchFilterBoxList: [{ restrictionList }],
    sortList: [
      {
        fieldName: 'id',
        type: searchQueryFilter.fieldOperation || 'DSC',
      },
    ],
    page: pageParam,
    rows: pageSize,
  };

  const encodedParams = encodeURIComponent(JSON.stringify(params));
  const url = `${LIST_URL}?searchFilterModel=${encodedParams}`;

  const result = await api.get<{ content: unknown[]; totalElements: number }>(url);

  if (!result.success) {
    return { success: false as const, message: result.message };
  }

  return {
    success: true as const,
    data: result.data.content,
    total: result.data.totalElements,
  };
}
