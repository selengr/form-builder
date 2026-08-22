import { useInfiniteQuery } from '@tanstack/react-query';
import { IGroup } from '@/app/groups/components/groupListItem';
import { getGroupsAction } from '../../../../../actions/groups/list';

export const useGroupsList = (query: string) => {
  const fetchGroups = async ({ pageParam = 0 }) => {
    const defaultSearchFilterModel = {
      searchFilterBoxList: [
        {
          restrictionList: query
            ? [
                {
                  fieldName: 'name',
                  fieldOperation: 'MATCH',
                  fieldValue: query,
                  nextConditionOperator: 'AND',
                },
              ]
            : [],
        },
      ],
      sortList: [{ fieldName: 'id', type: 'DSC' }],
      page: pageParam,
      rows: 10,
    };

    const encoded = encodeURIComponent(
      JSON.stringify(defaultSearchFilterModel)
    );

    const res = await getGroupsAction(encoded);

    if (!res.success) {
      throw new Error(res.message || 'خطا در دریافت لیست گروه‌ها');
    }

    return {
      groups: res.data.content.map((item) => ({
        id: item.groupId,
        name: item.groupName,
        description: '',
        userCount: item.groupMemberCount,
        invalid: item.invalid,
      })) as IGroup[],
      total: res.data.totalElements,
      nextPage: res.data.content.length > 0 ? pageParam + 1 : null,
    };
  };

  return useInfiniteQuery({
    queryKey: ['groups', query],
    queryFn: ({ pageParam }) => fetchGroups({ pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};
