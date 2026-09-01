'use server';

import { api } from '@/services/axios/actionWapper';

interface SearchBoxItem {
  fieldName: string;
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
  formId: string;
  searchQueryFilter: ReportersSearchQueryFilter;
  pageSize?: number;
}

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
  formId,
  searchQueryFilter,
  pageSize = 10,
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
    rows: pageSize,
  };

  const url =
    `/admin/destroy-form/listgrid-reporters-on-form/${formId}?searchFilterModel=` +
    encodeURIComponent(JSON.stringify(params));

  const result = await api.get<{
    content: unknown[];
    totalElements?: number;
    publicationApprovalByAdmin?: boolean | null;
  }>(url);

  if (!result.success) {
    return { success: false as const, message: result.message };
  }

  return {
    success: true as const,
    data: result.data.content ?? [],
    total: result.data.totalElements ?? result.data.content?.length ?? 0,
    publicationApprovalByAdmin: result.data.publicationApprovalByAdmin ?? null,
  };
}
