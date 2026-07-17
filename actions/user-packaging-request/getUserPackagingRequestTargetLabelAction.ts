'use server';

import { api } from '@/services/axios/actionWapper';

export interface UserPackagingRequestTargetLabel {
  value: string;
  caption: string;
}

type TargetLabelResponse = {
  dataList: UserPackagingRequestTargetLabel[];
};

export async function getUserPackagingRequestTargetLabelAction() {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'PROJECTS',
    input: '',
    page: 0,
    rows: 1000,
  };

  const url =
    `/admin/packaging/target-label/custom-combo?customComboFilterModel=${encodeURIComponent(
      JSON.stringify(customComboFilterModel),
    )}`;

  return api.get<TargetLabelResponse>(url);
}
