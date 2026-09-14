'use server';

import { api } from '@/services/axios/actionWapper';

export async function getGroupsComboAction() {
  return api.get('/user-group/introducer/groups-custom-combo');
}
