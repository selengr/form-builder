'use server';

import { api } from '@/services/axios/actionWapper';
import type { IUserGroupMemmerInfo } from '@/types/setting';

export interface GroupItemAPI {
  groupName: string;
  groupId: number;
  groupMemberCount: number;
  invalid?: boolean;
  fullyPublished?: boolean;
  incompletelyPublished?: boolean;
}

export interface GroupListResponse {
  content: GroupItemAPI[];
  totalElements: number;
  totalPages?: number;
}

export interface SearchBoxItem {
  fieldName: string;
  fieldOperation: 'MATCH' | 'EQUAL' | 'DSC' | 'ASC' | 'IN';
  fieldValue: string | string[];
  nextConditionOperator: 'OR' | 'AND';
}

function isValidRestriction(item?: SearchBoxItem) {
  if (!item) return false;
  if (typeof item.fieldValue === 'string') return item.fieldValue.trim() !== '';
  if (Array.isArray(item.fieldValue)) return item.fieldValue.length > 0;
  return true;
}

function buildSearchFilterModel(input: {
  page: number;
  rows: number;
  searchBoxList?: SearchBoxItem[];
}) {
  const restrictionList = (input.searchBoxList ?? []).filter(isValidRestriction);
  const searchFilterBoxList =
    restrictionList.length > 0 ? [{ restrictionList }] : [];

  return {
    searchFilterBoxList,
    sortList: [{ fieldName: 'id', type: 'DSC' }],
    page: input.page,
    rows: input.rows,
  };
}


export async function getGroupsAction(searchFilterModel: string) {
  const url = `/user-group/introducer/group-listgrid?searchFilterModel=${searchFilterModel}`;
  return api.get<GroupListResponse>(url);
}


export async function getGroupsListAction(input: {
  pageParam?: number;
  pageSize?: number;
  searchBoxList?: SearchBoxItem[];
  formId?: number | string;
}) {
  const page = input.pageParam ?? 0;
  const rows = input.pageSize ?? 10;
  const model = buildSearchFilterModel({
    page,
    rows,
    searchBoxList: input.searchBoxList,
  });
  const encoded = encodeURIComponent(JSON.stringify(model));

  const url =
    input.formId != null && input.formId !== ''
      ? `/user-group/introducer/group-listgrid?searchFilterModel=${encoded}&formId=${input.formId}`
      : `/user-group/introducer/group-listgrid?searchFilterModel=${encoded}`;

  return api.get<GroupListResponse>(url);
}

export interface GroupMembersListResponse {
  content: IUserGroupMemmerInfo[];
  totalPages: number;
  totalElements: number;
}

export async function getGroupMembersAction(input: {
  groupId: number | string;
  pageParam?: number;
  pageSize?: number;
  searchBoxList?: SearchBoxItem[];
  formId?: number | string;

  searchFilterModel?: string;
}) {
  const groupId = Number(input.groupId);
  if (!Number.isFinite(groupId)) {
    return {
      success: false as const,
      message: 'شناسه گروه نامعتبر است',
    };
  }

  let encoded = input.searchFilterModel;
  if (!encoded) {
    const model = buildSearchFilterModel({
      page: input.pageParam ?? 0,
      rows: input.pageSize ?? 10,
      searchBoxList: input.searchBoxList,
    });
    encoded = encodeURIComponent(JSON.stringify(model));
  }

  const base = `/user-group/introducer/group-listgrid/${groupId}/members?searchFilterModel=${encoded}`;
  const url =
    input.formId != null && input.formId !== ''
      ? `${base}&formId=${input.formId}`
      : base;

  return api.get<GroupMembersListResponse>(url);
}
