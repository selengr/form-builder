import { getReportersListAction } from '@actions/user-reports-new/getReportersListAction';
import {
  UnifiedListGridFetcher,
  UnifiedListGridFetchParams,
} from '@/components/unified-list-grid';
import { applySearchValue } from '@/components/unified-list-grid/utils/searchBoxList';
import { TReporterInformationItem } from './type';

export function createReportersListFetcher(
  formId: string,
): UnifiedListGridFetcher<TReporterInformationItem> {
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

    const updatedSearchBoxList = applySearchValue(searchBoxList, searchField, searchValue);

    const result = await getReportersListAction({
      pageParam,
      searchBoxList: updatedSearchBoxList,
      filterBoxList,
      formId,
      pageSize,
      searchQueryFilter: {
        responseForDestroyerReport: searchQueryFilter.responseForDestroyerReport ?? 'ALL',
        typeOfReport: searchQueryFilter.typeOfReport ?? 'ALL',
        fieldOperation: searchQueryFilter.fieldOperation ?? 'DSC',
      },
    });

    if (!result.success) {
      return { success: false, message: result.message };
    }

    return {
      success: true,
      data: result.data as TReporterInformationItem[],
      total: result.total,
    };
  };
}
