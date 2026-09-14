'use server';

import { z } from 'zod';
import { api } from '@/services/axios/actionWapper';

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

export async function getShowReportForResponderAction(input: {
  formId: number | string;
  groupId: number | string;
}) {
  const formId = Number(input.formId);
  const groupId = Number(input.groupId);

  if (!Number.isFinite(formId) || !Number.isFinite(groupId)) {
    return {
      success: false as const,
      message: 'شناسه فرم یا گروه نامعتبر است',
    };
  }

  return api.get<{ showReportForResponder: boolean }>(
    `/form-publish-setting/find-group-config/${formId}/${groupId}`,
  );
}

export async function updateShowReportForResponderAction(input: {
  formId: number | string;
  groupId: number | string;
  showReportForResponder: boolean;
}) {
  const formId = Number(input.formId);
  const groupId = Number(input.groupId);

  if (!Number.isFinite(formId) || !Number.isFinite(groupId)) {
    return {
      success: false as const,
      message: 'شناسه فرم یا گروه نامعتبر است',
    };
  }

  return api.put(
    `/form-publish-setting/update-group-config/${formId}/${groupId}`,
    { showReportForResponder: input.showReportForResponder },
  );
}
