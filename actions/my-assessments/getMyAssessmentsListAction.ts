'use server';

import { api } from '@/services/axios/actionWapper';

/** Preserved from legacy list — fetches a large page so UI behaves the same. */
const PAGE_SIZE = 1000;
const LIST_URL = '/user/form/main-list';

interface SearchBoxItem {
  fieldName: string;
  fieldOperation: 'MATCH' | 'EQUAL' | 'DSC' | 'ASC' | 'IN';
  fieldValue: string | string[];
  nextConditionOperator: 'OR' | 'AND';
}

export interface MyAssessmentsSearchQueryFilter {
  type: string;
  status: string;
  takeParts: string;
  showReport: string;
}

export interface GetMyAssessmentsListParams {
  pageParam: number;
  searchBoxList: SearchBoxItem[];
  filterBoxList: SearchBoxItem[];
  searchQueryFilter: MyAssessmentsSearchQueryFilter;
  pageSize?: number;
}

function isValidRestriction(item?: SearchBoxItem) {
  if (!item) return false;
  if (typeof item.fieldValue === 'string') return item.fieldValue !== '';
  if (Array.isArray(item.fieldValue)) return item.fieldValue.length > 0;
  return true;
}

export async function getMyAssessmentsListAction({
  pageParam,
  searchBoxList,
  filterBoxList,
  searchQueryFilter,
  pageSize = PAGE_SIZE,
}: GetMyAssessmentsListParams) {
  const filterRestrictions: SearchBoxItem[] = [];

  if (searchQueryFilter.type !== 'ALL') {
    filterRestrictions.push({
      fieldName: 'typeEnum',
      fieldOperation: 'EQUAL',
      fieldValue: searchQueryFilter.type,
      nextConditionOperator: 'AND',
    });
  }

  if (searchQueryFilter.status !== 'ALL') {
    filterRestrictions.push({
      fieldName: 'status',
      fieldOperation: 'EQUAL',
      fieldValue: searchQueryFilter.status,
      nextConditionOperator: 'AND',
    });
  }

  if (searchQueryFilter.takeParts !== 'ALL') {
    filterRestrictions.push({
      fieldName: 'takeParts.filter',
      fieldOperation: 'EQUAL',
      fieldValue: searchQueryFilter.takeParts,
      nextConditionOperator: 'AND',
    });
  }

  if (searchQueryFilter.showReport !== 'ALL') {
    filterRestrictions.push({
      fieldName: 'showReport.filter',
      fieldOperation: 'EQUAL',
      fieldValue: searchQueryFilter.showReport,
      nextConditionOperator: 'AND',
    });
  }

  const restrictionList = [...searchBoxList, ...filterBoxList, ...filterRestrictions].filter(
    isValidRestriction,
  );

  const params = {
    searchFilterBoxList: [{ restrictionList }],
    sortList: [{ fieldName: 'id', type: 'DSC' }],
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
