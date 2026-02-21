'use server';

import { serverApi } from '@/services/axios/serverApi';

interface SearchBoxItem {
  fieldName: string;
  fieldOperation: 'MATCH' | 'EQUAL' | 'DSC' | 'ASC' | 'IN';
  fieldValue: string | string[];
  nextConditionOperator: 'OR' | 'AND';
}

const PAGE_SIZE = 10;
const DEFAULT_SEARCH_FILTER = { type: 'ALL', status: 'PUBLIC' };

export async function fetchListGridData(
  pageParam: number,
  searchBoxList: SearchBoxItem[],
  filterBoxList: SearchBoxItem[],
  url: string,
  searchQueryFilter = DEFAULT_SEARCH_FILTER,
) {
  try {
    const filterRestrictions: SearchBoxItem[] = [];

    if (searchQueryFilter.type && searchQueryFilter.type !== 'ALL') {
      filterRestrictions.push({
        fieldName: 'typeEnum',
        fieldOperation: 'EQUAL',
        fieldValue: searchQueryFilter.type,
        nextConditionOperator: 'AND',
      });
    }

    if (searchQueryFilter.status && searchQueryFilter.status !== 'ALL') {
      filterRestrictions.push({
        fieldName: 'status',
        fieldOperation: 'EQUAL',
        fieldValue: searchQueryFilter.status,
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

    const searchFilterBoxListPayload = [
      { restrictionList: validCombinedRestrictionList },
    ];

    const params = {
      searchFilterBoxList: searchFilterBoxListPayload,
      sortList: [{ fieldName: 'id', type: 'DSC' }],
      page: pageParam,
      rows: PAGE_SIZE,
    };

    const queryString = JSON.stringify(params);
    const encodedParams = encodeURIComponent(queryString);
    const fullURL =
      `${url}?searchFilterModel=` +
      (encodedParams === encodeURIComponent('{}') ? '' : encodedParams);

    const response = await serverApi.get(fullURL);

    if (!response?.data) {
      throw new Error('خطا در دریافت اطلاعات');
    }

    return {
      data: response.data.content,
      total: response.data.totalElements,
    };
  } catch (error) {
    console.error('Server Action Error:', error);
    throw new Error('خطا در دریافت اطلاعات');
  }
}
