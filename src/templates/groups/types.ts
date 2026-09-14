export interface GroupListItem {
  id: number;
  name: string;
  description: string;
  userCount: number;
  invalid?: boolean;
}

export const GROUPS_LIST_QUERY_KEY = 'groups_list';
