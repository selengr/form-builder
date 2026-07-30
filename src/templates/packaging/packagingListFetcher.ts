import { getPackagingListAction } from '@actions/packaging/getPackagingListAction';
import {
  UnifiedListGridFetcher,
  UnifiedListGridFetchParams,
} from '@/components/unified-list-grid';
import { applySearchValue } from '@/components/unified-list-grid/utils/searchBoxList';
import { PackagingListItem } from './types';

export const packagingListFetcher: UnifiedListGridFetcher<PackagingListItem> = async ({
  pageParam,
  searchValue,
  searchBoxList,
  filterBoxList,
  searchQueryFilter,
}: UnifiedListGridFetchParams) => {
  const searchField =
    searchBoxList.find((item) => item.fieldOperation === 'MATCH')?.fieldName ?? 'name';

  const updatedSearchBoxList = applySearchValue(searchBoxList, searchField, searchValue);

  const result = await getPackagingListAction({
    pageParam,
    searchBoxList: updatedSearchBoxList,
    filterBoxList,
    searchQueryFilter: {
      isCreatedSoloReport: searchQueryFilter.isCreatedSoloReport ?? 'ALL',
      packagingStatusEnum: searchQueryFilter.packagingStatusEnum ?? 'ALL',
      fieldOperation: searchQueryFilter.fieldOperation ?? 'DSC',
    },
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return {
    success: true,
    data: result.data as PackagingListItem[],
    total: result.total,
  };
};
