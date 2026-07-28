'use server';

import { api } from '@/services/axios/actionWapper';

const PAGE_SIZE = 10;

interface SearchBoxItem {
  fieldName: string;
  fieldOperation: 'MATCH' | 'EQUAL' | 'DSC' | 'ASC' | 'IN';
  fieldValue: string | string[];
  nextConditionOperator: 'OR' | 'AND';
}

export interface PackagingListSearchQueryFilter {
  isCreatedSoloReport: string;
  packagingStausEnum: string;
  fieldOperation: string;
}

export interface GetPackagingListParams {
  pageParam: number;
  searchBoxList: SearchBoxItem[];
  filterBoxList: SearchBoxItem[];
  searchQueryFilter: PackagingListSearchQueryFilter;
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

export async function getPackagingListAction({
  pageParam,
  searchBoxList,
  filterBoxList,
  searchQueryFilter,
}: GetPackagingListParams) {
  const filterRestrictions: SearchBoxItem[] = [];

  if (
    searchQueryFilter.isCreatedSoloReport &&
    searchQueryFilter.isCreatedSoloReport !== 'ALL'
  ) {
    filterRestrictions.push({
      fieldName: 'isCreatedSoloReport.filter',
      fieldOperation: 'EQUAL',
      fieldValue: searchQueryFilter.isCreatedSoloReport,
      nextConditionOperator: 'AND',
    });
  }

  if (
    searchQueryFilter.packagingStausEnum &&
    searchQueryFilter.packagingStausEnum !== 'ALL'
  ) {
    filterRestrictions.push({
      fieldName: 'packagingStausEnum.filter',
      fieldOperation: 'EQUAL',
      fieldValue: searchQueryFilter.packagingStausEnum,
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
  const url = `/admin/packaging/main-list?searchFilterModel=${encodedParams}`;

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
