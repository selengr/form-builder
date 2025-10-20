import { useQuery } from '@tanstack/react-query';
import { getAuthToken } from '@/utils/getAuthToken';
import { IUserGroupMemmerInfo, IUseFetchMembersParams } from '@/types/setting';


const fetchMembers = async ({
  formId,
  groupId,
  searchBoxList,
}: IUseFetchMembersParams): Promise<IUserGroupMemmerInfo[]> => {
  const token = await getAuthToken();

  const validCombinedRestrictionList = searchBoxList.filter((item) => {
    if (item === undefined || item === null) return false;
    if (typeof item.fieldValue === 'string') {
      return item.fieldValue !== '';
    }
    if (Array.isArray(item.fieldValue)) {
      return item.fieldValue.length > 0;
    }
    return true;
  });

  const searchFilterBoxListPayload =
  validCombinedRestrictionList.length > 0
    ? [{ restrictionList: validCombinedRestrictionList }]
    : [];

  const params = {
    searchFilterBoxList: searchFilterBoxListPayload,
    sortList: [{ fieldName: 'id', type: 'DSC' }],
    page: 0,
    rows: 100,
  };

  const encoded = encodeURIComponent(JSON.stringify(params));

   const res = await fetch(`/api/group/list/${groupId}?searchFilterModel=${encoded}&formId=${formId}`, {
        headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'دریافت لیست گروه‌ها ناموفق بود.');
  }

  const data = await res.json();
  const members = Array.isArray(data?.content) ? data.content : [];

  return members;
};

export const useFetchMembersSetting = ({ formId, groupId, searchBoxList }: IUseFetchMembersParams) => {
  return useQuery({
    queryKey: ['members', formId, groupId, searchBoxList],
    queryFn: () => fetchMembers({ formId, groupId, searchBoxList }),
    enabled: !!formId && !!groupId, 
  });
};
