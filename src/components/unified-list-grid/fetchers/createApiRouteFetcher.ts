import {
  UnifiedListGridFetcher,
  UnifiedListGridFetchParams,
} from '../types';
import { buildFilterRestrictions } from '../utils/filterRestrictions';
import { applySearchValue } from '../utils/searchBoxList';

export function createApiRouteFetcher<TItem = unknown>(
  apiPath: string,
  options?: {
    filterFieldMappings?: Parameters<typeof buildFilterRestrictions>[1];
  },
): UnifiedListGridFetcher<TItem> {
  return async ({
    pageParam,
    searchValue,
    searchBoxList,
    filterBoxList,
    searchQueryFilter,
    pageSize,
  }: UnifiedListGridFetchParams) => {
    const searchField =
      searchBoxList.find((item) => item.fieldOperation === 'MATCH')?.fieldName ??
      'formSetting.name';

    const updatedSearchBoxList = applySearchValue(
      searchBoxList,
      searchField,
      searchValue,
    );

    const filterRestrictions = buildFilterRestrictions(
      searchQueryFilter,
      options?.filterFieldMappings,
    );

    const params = new URLSearchParams({
      page: String(pageParam),
      rows: String(pageSize),
      searchFilterModel: JSON.stringify({
        searchFilterBoxList: [
          {
            restrictionList: [
              ...updatedSearchBoxList,
              ...filterBoxList,
              ...filterRestrictions,
            ].filter(Boolean),
          },
        ],
        sortList: [
          {
            fieldName: 'id',
            type: searchQueryFilter.fieldOperation ?? 'DSC',
          },
        ],
        page: pageParam,
        rows: pageSize,
      }),
    });

    const response = await fetch(`${apiPath}?${params.toString()}`);

    if (!response.ok) {
      return {
        success: false,
        message: 'خطا در دریافت اطلاعات',
      };
    }

    const payload = await response.json();

    if (!payload.success) {
      return {
        success: false,
        message: payload.message ?? 'خطا در دریافت اطلاعات',
      };
    }

    return {
      success: true,
      data: payload.data as TItem[],
      total: payload.total,
    };
  };
}
