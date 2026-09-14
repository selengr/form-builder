'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getGroupMembersAction } from '@actions/groups/member';
import type { IUserGroupMemmerInfo, IUseFetchMembersParams } from '@/types/setting';
import type { SearchBoxItem } from '@/components/ListGrid/ListGrid';

interface FetchMembersPageParams {
  formId?: number | string;
  groupId: number | null | 'default';
  searchBoxList: SearchBoxItem[];
  pageParam?: number;
  pageSize?: number;
}

const fetchMembersPage = async ({
  formId,
  groupId,
  searchBoxList,
  pageParam = 0,
  pageSize = 30,
}: FetchMembersPageParams): Promise<{ data: IUserGroupMemmerInfo[]; nextPage: number | null }> => {
  const validCombinedRestrictionList = searchBoxList.filter((item) => {
    if (!item) return false;
    if (typeof item.fieldValue === 'string') return item.fieldValue.trim() !== '';
    if (Array.isArray(item.fieldValue)) return item.fieldValue.length > 0;
    return true;
  });

  const searchFilterBoxListPayload =
    validCombinedRestrictionList.length > 0
      ? [{ restrictionList: validCombinedRestrictionList }]
      : [];

  const params = {
    searchFilterBoxList: searchFilterBoxListPayload,
    sortList: [{ fieldName: 'id', type: 'DSC' }],
    page: pageParam,
    rows: pageSize,
  };

  const encoded = encodeURIComponent(JSON.stringify(params));

  const res = await getGroupMembersAction({
    groupId: String(groupId),
    searchFilterModel: encoded,
    formId,
  });

  if (!res.success) {
    throw new Error(res.message || 'دریافت لیست اعضا ناموفق بود.');
  }

  const members = Array.isArray(res.data?.content) ? res.data.content : [];
  const nextPage =
    res.data.totalPages && pageParam + 1 < res.data.totalPages ? pageParam + 1 : null;

  return { data: members, nextPage };
};

export const useFetchGroupMembers = ({
  formId,
  groupId,
  searchBoxList,
  pageSize = 10,
}: Omit<IUseFetchMembersParams, 'formId'> & {
  formId?: number | string;
  pageSize?: number;
}) => {
  return useInfiniteQuery({
    queryKey: ['members-setting', groupId, searchBoxList, formId ?? 'no-form'],
    queryFn: ({ pageParam = 0 }) =>
      fetchMembersPage({ formId, groupId, searchBoxList, pageParam, pageSize }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled: !!groupId,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });
};
