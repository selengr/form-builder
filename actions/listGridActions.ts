'use server';

import { serverApi } from '@/services/axios/serverApi';

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
      fieldOperation: 'EQUAL',
      fieldValue: filter[key],
      nextConditionOperator: 'AND',
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
  try {
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

    const { data } = await serverApi.get(fullURL);

    if (!data) {
      throw new Error('خطا در دریافت اطلاعات');
    }

    return {
      data: data.content,
      total: data.totalElements,
    };
  } catch (error) {
    console.error('Server Action Error:', error);
    throw new Error('خطا در دریافت اطلاعات');
  }
}
