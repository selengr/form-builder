import { getGroupsAction } from '@actions/groups/list';
import {
  UnifiedListGridFetcher,
  UnifiedListGridFetchParams,
} from '@/components/unified-list-grid';
import { applySearchValue } from '@/components/unified-list-grid/utils/searchBoxList';
import { GroupListItem } from './types';

export const groupsListFetcher: UnifiedListGridFetcher<GroupListItem> = async ({
  pageParam,
  searchValue,
  searchBoxList,
  pageSize,
}: UnifiedListGridFetchParams) => {
  const searchField =
    searchBoxList.find((item) => item.fieldOperation === 'MATCH')?.fieldName ?? 'name';

  const updatedSearchBoxList = applySearchValue(searchBoxList, searchField, searchValue);
  const restrictionList = updatedSearchBoxList.filter(
    (item) => String(item.fieldValue ?? '').trim().length > 0,
  );

  const searchFilterModel = {
    searchFilterBoxList: [{ restrictionList }],
    sortList: [{ fieldName: 'id', type: 'DSC' }],
    page: pageParam,
    rows: pageSize,
  };

  const encoded = encodeURIComponent(JSON.stringify(searchFilterModel));
  const result = await getGroupsAction(encoded);

  if (!result.success) {
    return { success: false, message: result.message };
  }

  const data: GroupListItem[] = (result.data.content ?? []).map((item) => ({
    id: item.groupId,
    name: item.groupName,
    description: '',
    userCount: item.groupMemberCount,
    invalid: item.invalid,
  }));

  return {
    success: true,
    data,
    total: result.data.totalElements,
  };
};
