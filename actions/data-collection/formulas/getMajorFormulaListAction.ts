'use server';

import { api } from '@/services/axios/actionWapper';

const PAGE_SIZE = 10;
const LIST_URL = '/admin/data-collection/formulas/major-list-grid';

interface SearchBoxItem {
  fieldName: string;
  fieldOperation: 'MATCH' | 'EQUAL' | 'DSC' | 'ASC' | 'IN';
  fieldValue: string | string[];
  nextConditionOperator: 'OR' | 'AND';
}

export interface MajorFormulaSearchQueryFilter {
  targetPlatformEnum: string;
  fieldOperation: string;
}

export interface GetMajorFormulaListParams {
  pageParam: number;
  searchBoxList: SearchBoxItem[];
  filterBoxList: SearchBoxItem[];
  searchQueryFilter: MajorFormulaSearchQueryFilter;
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

export async function getMajorFormulaListAction({
  pageParam,
  searchBoxList,
  filterBoxList,
  searchQueryFilter,
}: GetMajorFormulaListParams) {
  const filterRestrictions: SearchBoxItem[] = [];

  if (
    searchQueryFilter.targetPlatformEnum &&
    searchQueryFilter.targetPlatformEnum !== 'ALL'
  ) {
    filterRestrictions.push({
      fieldName: 'targetPlatformEnum',
      fieldOperation: 'EQUAL',
      fieldValue: searchQueryFilter.targetPlatformEnum,
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
