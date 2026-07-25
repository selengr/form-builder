import { fetchListGridData } from '../../../../actions/listGridActions';
import {
  UnifiedListGridFetcher,
  UnifiedListGridFetchParams,
} from '../types';
import { buildFilterRestrictions } from '../utils/filterRestrictions';
import { applySearchValue } from '../utils/searchBoxList';

export function createServerActionFetcher<TItem = unknown>(
  url: string,
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

    const result = await fetchListGridData(
      { pageParam },
      [...updatedSearchBoxList, ...filterRestrictions],
      filterBoxList,
      url,
      searchQueryFilter as {
        type: string;
        status: string;
        isCreatedSoloReport: string;
        fieldOperation: string;
      },
    );

    if (!result.success) {
      return { success: false, message: result.message };
    }
console.log('result.data-----------', JSON.stringify(result.data))
    return {
      success: true,
      data: result.data as TItem[],
      total: result.total,
    };
  };
}
