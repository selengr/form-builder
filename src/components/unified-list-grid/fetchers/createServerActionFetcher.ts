import { fetchListGridData } from '../../../../actions/listGridActions';
import {
  UnifiedListGridFetcher,
  UnifiedListGridFetchParams,
} from '../types';
import { buildFilterRestrictions } from '../utils/filterRestrictions';
import { applySearchValue } from '../utils/searchBoxList';

export function createServerActionFetcher(
  url: string,
  options?: {
    filterFieldMappings?: Parameters<typeof buildFilterRestrictions>[1];
  },
): UnifiedListGridFetcher {
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

    return {
      success: true,
      data: result.data,
      total: result.total,
    };
  };
}
