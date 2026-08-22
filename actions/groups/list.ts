'use server';

import { api } from '@/services/axios/actionWapper';

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
  return api.get<GroupListResponse>(url);
}
