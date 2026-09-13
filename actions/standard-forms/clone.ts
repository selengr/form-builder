'use server';

import { api } from '@/services/axios/actionWapper';

export async function clonePackageAction(id: number) {
  return api.post('/user/packaging/clone', { id });
}
