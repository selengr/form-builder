import { useQuery } from '@tanstack/react-query';
import { getAuthToken } from '@/utils/getAuthToken';
import { IGroup } from '@/app/groups/components/groupListItem';
import { SearchBoxItem } from '@/components/ListGrid/ListGrid';

interface UseFetchGroupsParams {
  formId: string | number;
  searchBoxList: SearchBoxItem[];
}

export interface GroupListResponse {
  content: any[];
}

const fetchGroups = async ({ formId, searchBoxList }: UseFetchGroupsParams): Promise<IGroup[]> => {
  const token = await getAuthToken();

  const validCombinedRestrictionList = searchBoxList.filter((item) => {
    if (!item) return false;
    if (typeof item.fieldValue === 'string') return item.fieldValue.trim() !== '';
    if (Array.isArray(item.fieldValue)) return item.fieldValue.length > 0;
    return true;
  });

  const searchFilterBoxListPayload =
    validCombinedRestrictionList.length > 0 ? [{ restrictionList: validCombinedRestrictionList }] : [];

  const params: any = {
    sortList: [{ fieldName: 'id', type: 'DSC' }],
    page: 0,
    rows: 100,
  };

  if (searchFilterBoxListPayload.length > 0) {
    params.searchFilterBoxList = searchFilterBoxListPayload;
  }

  const queryParams = new URLSearchParams();
  queryParams.set('searchFilterModel', JSON.stringify(params));
  queryParams.set('formId', String(formId));

  const res = await fetch(`/api/group/list?${queryParams.toString()}`, {
    headers: {
    //   'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'دریافت لیست گروه‌ها ناموفق بود.');
  }

  const data: GroupListResponse = await res.json();

  const transformed: IGroup[] = data.content.map((item: any) => ({
    id: item.groupId,
    name: item.groupName,
    description: '',
    userCount: item.groupMemberCount,
    isSelected: item.isSelected || false,
  }));

  return transformed;
};

export const useFetchGroupsSetting = ({ formId, searchBoxList }: UseFetchGroupsParams) => {
  return useQuery({
    queryKey: ['groups', formId, searchBoxList],
    queryFn: () => fetchGroups({ formId, searchBoxList }),
    enabled: !!formId,
  });
};
