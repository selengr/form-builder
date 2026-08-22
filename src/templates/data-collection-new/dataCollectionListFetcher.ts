import { getDataCollectionListAction } from '@actions/data-collection-new/getDataCollectionListAction';
import {
  UnifiedListGridFetcher,
  UnifiedListGridFetchParams,
} from '@/components/unified-list-grid';
import { applySearchValue } from '@/components/unified-list-grid/utils/searchBoxList';
import { DataCollectionListItem } from './types';

export const dataCollectionListFetcher: UnifiedListGridFetcher<DataCollectionListItem> = async ({
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

  const result = await getDataCollectionListAction({
    pageParam,
    searchBoxList: updatedSearchBoxList,
    filterBoxList,
    searchQueryFilter: {
      surveyTargetPlatformEnum: searchQueryFilter.surveyTargetPlatformEnum ?? 'ALL',
      fieldOperation: searchQueryFilter.fieldOperation ?? 'DSC',
    },
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return {
    success: true,
    data: result.data as DataCollectionListItem[],
    total: result.total,
  };
};
