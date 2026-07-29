'use server';

import { api } from '@/services/axios/actionWapper';

export async function getPackageSettingAction(id: number) {
  return api.get(`/admin/packaging/${id}`);
}

export async function putPackageSettingAction(
  id: number,
  payload: {
    name: string;
    ratio: number;
    formCategorysModel?: { categoryId: number[] } | null;
  },
) {
  return api.put(`/admin/packaging/${id}`, payload);
}

export async function updatePackagingValidity(id: number, invalid: boolean) {
  return api.put(`/admin/packaging/main-list/invalid`, { id, invalid });
}