import { getMyAssessmentsListAction } from '@actions/my-assessments/getMyAssessmentsListAction';
import {
  UnifiedListGridFetcher,
  UnifiedListGridFetchParams,
} from '@/components/unified-list-grid';
import { applySearchValue } from '@/components/unified-list-grid/utils/searchBoxList';
import { MyAssessmentsListItem } from './types';

export const myAssessmentsListFetcher: UnifiedListGridFetcher<MyAssessmentsListItem> = async ({
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

  const result = await getMyAssessmentsListAction({
    pageParam,
    searchBoxList: updatedSearchBoxList,
    filterBoxList,
    pageSize,
    searchQueryFilter: {
      type: searchQueryFilter.type ?? 'ALL',
      status: searchQueryFilter.status ?? 'ALL',
      takeParts: searchQueryFilter.takeParts ?? 'ALL',
      showReport: searchQueryFilter.showReport ?? 'ALL',
    },
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return {
    success: true,
    data: result.data as MyAssessmentsListItem[],
    total: result.total,
  };
};
