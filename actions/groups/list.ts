'use server';

import { serverApi } from '@/services/axios/serverApi';

export interface GroupItemAPI {
  groupName: string;
  groupId: number;
  groupMemberCount: number;
  invalid?: boolean;
}

export interface GroupListResponse {
  content: GroupItemAPI[];
  totalElements: number;
}

export async function getGroupsAction(searchFilterModel: string) {
  const url = `/user-group/introducer/group-listgrid?searchFilterModel=${searchFilterModel}`;

  const res = await serverApi.get(url);

  return res.data as GroupListResponse;
}
