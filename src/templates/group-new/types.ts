export interface GroupListItem {
  id: number;
  name: string;
  description: string;
  userCount: number;
  invalid?: boolean;
}

export const GROUP_NEW_LIST_QUERY_KEY = 'group_new_list';
