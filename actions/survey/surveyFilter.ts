'use server';

import { serverApi } from '@/services/axios/serverApi';

interface SearchBoxItem {
  fieldName: string;
  fieldOperation: 'MATCH' | 'EQUAL' | 'DSC' | 'ASC' | 'IN';
  fieldValue: string | string[];
  nextConditionOperator: 'OR' | 'AND';
}

const PAGE_SIZE = 10;
const DEFAULT_SEARCH_FILTER = { surveyTargetPlatformEnum: 'ALL', isCreatedSoloReport: 'All', fieldOperation : "DSC"  };

export async function surveyFilter(
  pageParam: number,
  searchBoxList: SearchBoxItem[],
  filterBoxList: SearchBoxItem[],
  url: string,
  searchQueryFilter = DEFAULT_SEARCH_FILTER,
) {
  // try {
    const filterRestrictions: SearchBoxItem[] = [];

    if (searchQueryFilter.isCreatedSoloReport && searchQueryFilter.isCreatedSoloReport !== 'ALL') {
      filterRestrictions.push({
        fieldName: 'isCreatedSoloReport.filter',
        fieldOperation: 'EQUAL',
        fieldValue: searchQueryFilter.isCreatedSoloReport,
        nextConditionOperator: 'AND',
      });
    }

    if (searchQueryFilter.surveyTargetPlatformEnum && searchQueryFilter.surveyTargetPlatformEnum !== 'ALL') {
      filterRestrictions.push({
        fieldName: 'formSetting.surveyTargetPlatformEnum',
        fieldOperation: 'EQUAL',
        fieldValue: searchQueryFilter.surveyTargetPlatformEnum,
        nextConditionOperator: 'AND',
      });
    }

    const validCombinedRestrictionList = [
      ...searchBoxList,
      ...filterBoxList,
      ...filterRestrictions,
    ].filter((item) => {
      if (!item) return false;
      if (typeof item.fieldValue === 'string') return item.fieldValue !== '';
      if (Array.isArray(item.fieldValue)) return item.fieldValue.length > 0;
      return true;
    });
console.log('validCombinedRestrictionList--------------------------------------', validCombinedRestrictionList)
    const searchFilterBoxListPayload = [
      { restrictionList: validCombinedRestrictionList },
    ];

    const params = {
      searchFilterBoxList: searchFilterBoxListPayload,
      sortList: [{ fieldName: 'id', type: searchQueryFilter.fieldOperation }],
      page: pageParam,
      rows: PAGE_SIZE,
    };

    const queryString = JSON.stringify(params);
    const encodedParams = encodeURIComponent(queryString);
    const fullURL =
      `${url}?searchFilterModel=` +
      (encodedParams === encodeURIComponent('{}') ? '' : encodedParams);

    const response = await serverApi.get(fullURL);

    // if (!response?.data) {
    //   throw new Error('خطا در دریافت اطلاعات');
    // }

    return {
      data: response.data.content,
      total: response.data.totalElements,
    };
    
  // } catch (error: any) {
  //   const message =
  //     error?.response?.data?.message?.[0]?.title ||
  //     error?.response?.data?.message ||
  //     'انجام عملیات با خطا مواجه شد';

  //   throw new Error(error);
  // }
}
