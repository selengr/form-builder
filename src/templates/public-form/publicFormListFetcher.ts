import { getPublicFormListAction } from '@actions/public-form/getPublicFormListAction';
import {
  UnifiedListGridFetcher,
  UnifiedListGridFetchParams,
} from '@/components/unified-list-grid';
import { applySearchValue } from '@/components/unified-list-grid/utils/searchBoxList';
import { PublicFormListItem } from './types';

export const publicFormListFetcher: UnifiedListGridFetcher<PublicFormListItem> = async ({
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

  const result = await getPublicFormListAction({
    pageParam,
    searchBoxList: updatedSearchBoxList,
    filterBoxList,
    pageSize,
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
    data: result.data as PublicFormListItem[],
    total: result.total,
  };
};
