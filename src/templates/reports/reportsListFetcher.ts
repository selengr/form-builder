import { getReportsMainListAction } from '@actions/report/getReportsMainListAction';
import {
  UnifiedListGridFetcher,
  UnifiedListGridFetchParams,
} from '@/components/unified-list-grid';
import { applySearchValue } from '@/components/unified-list-grid/utils/searchBoxList';
import { ReportsListItem } from './types';

export const reportsListFetcher: UnifiedListGridFetcher<ReportsListItem> = async ({
  pageParam,
  searchValue,
  searchBoxList,
  filterBoxList,
  searchQueryFilter,
}: UnifiedListGridFetchParams) => {
  const searchField =
    searchBoxList.find((item) => item.fieldOperation === 'MATCH')?.fieldName ??
    'formSetting.name';

  const updatedSearchBoxList = applySearchValue(searchBoxList, searchField, searchValue);

  const result = await getReportsMainListAction({
    pageParam,
    searchBoxList: updatedSearchBoxList,
    filterBoxList,
    searchQueryFilter: {
      type: searchQueryFilter.type ?? 'ALL',
      status: searchQueryFilter.status ?? 'PUBLIC',
      isCreatedSoloReport: searchQueryFilter.isCreatedSoloReport ?? 'ALL',
      fieldOperation: searchQueryFilter.fieldOperation ?? 'DSC',
    },
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return {
    success: true,
    data: result.data as ReportsListItem[],
    total: result.total,
  };
};
