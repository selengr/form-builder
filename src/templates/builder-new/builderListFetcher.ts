import { getBuilderListAction } from '@actions/builder/getBuilderListAction';
import {
  UnifiedListGridFetcher,
  UnifiedListGridFetchParams,
} from '@/components/unified-list-grid';
import { applySearchValue } from '@/components/unified-list-grid/utils/searchBoxList';
import { BuilderListItem } from './types';

export const builderListFetcher: UnifiedListGridFetcher<BuilderListItem> = async ({
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

  const result = await getBuilderListAction({
    pageParam,
    searchBoxList: updatedSearchBoxList,
    filterBoxList,
    searchQueryFilter: {
      type: searchQueryFilter.type ?? 'ALL',
      status: searchQueryFilter.status ?? 'ALL',
      isCreatedSoloReport: searchQueryFilter.isCreatedSoloReport ?? 'ALL',
      fieldOperation: searchQueryFilter.fieldOperation ?? 'DSC',
    },
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return {
    success: true,
    data: result.data as BuilderListItem[],
    total: result.total,
  };
};
