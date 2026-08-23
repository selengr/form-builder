'use server';

import { api } from '@/services/axios/actionWapper';

const PAGE_SIZE = 10;
const LIST_URL = '/admin/form/survey/main-list';

interface SearchBoxItem {
  fieldName: string;
  fieldOperation: 'MATCH' | 'EQUAL' | 'DSC' | 'ASC' | 'IN';
  fieldValue: string | string[];
  nextConditionOperator: 'OR' | 'AND';
}

export interface SurveyListSearchQueryFilter {
  isCreatedSoloReport: string;
  surveyTargetPlatformEnum: string;
  fieldOperation: string;
}

export interface GetSurveyListParams {
  pageParam: number;
  searchBoxList: SearchBoxItem[];
  filterBoxList: SearchBoxItem[];
  searchQueryFilter: SurveyListSearchQueryFilter;
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

export async function getSurveyListAction({
  pageParam,
  searchBoxList,
  filterBoxList,
  searchQueryFilter,
}: GetSurveyListParams) {
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
    searchQueryFilter.surveyTargetPlatformEnum &&
    searchQueryFilter.surveyTargetPlatformEnum !== 'ALL'
  ) {
    filterRestrictions.push({
      fieldName: 'formSetting.surveyTargetPlatformEnum',
      fieldOperation: 'EQUAL',
      fieldValue: searchQueryFilter.surveyTargetPlatformEnum,
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
