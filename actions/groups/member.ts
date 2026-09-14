'use server';

import { z } from 'zod';
import { api } from '@/services/axios/actionWapper';
import type { IUserGroupMemmerInfo } from '@/types/setting';

export async function changeMemberStatusAction(input: {
  groupId: number | null;
  introducedUserJTGroupId: number;
  invalid: boolean;
  rememberAllocation: boolean;
}) {
  return api.post('/user-group/introducer/change-status-member', input);
}

const addMemberSchema = z.object({
  name: z.string(),
  lname: z.string(),
  username: z.string(),
  gender: z.enum(['MALE', 'FEMALE']),
  groupId: z.number().nullable(),
});

export type AddMemberToGroupInput = z.infer<typeof addMemberSchema>;

export async function addMemberToGroupAction(input: AddMemberToGroupInput) {
  const parsed = addMemberSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      message: 'Validation error.',
    };
  }

  return api.post('/user-group/introducer/add-member-to-group', parsed.data);
}

export interface GroupMembersListResponse {
  content: IUserGroupMemmerInfo[];
  totalPages: number;
  totalElements: number;
}

export async function getGroupMembersAction(input: {
  groupId: number | string;
  searchFilterModel: string;
  formId?: number | string;
}) {
  const { groupId, searchFilterModel, formId } = input;
  const base = `/user-group/introducer/group-listgrid/${groupId}/members?searchFilterModel=${searchFilterModel}`;
  const url = formId != null && formId !== '' ? `${base}&formId=${formId}` : base;

  return api.get<GroupMembersListResponse>(url);
}
