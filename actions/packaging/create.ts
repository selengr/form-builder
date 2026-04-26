'use server';

import { serverApi } from '@/services/axios/serverApi';
import { IPayloadPackage } from '@/templates/packaging/hooks/useCreatePackaging';


export async function createPackageAction(data : IPayloadPackage) {
  console.log('data------------------', data)
  console.log('data------------------2', data.name)
  console.log('data------------------3', data.targetLabelEnum)
  console.log('data------------------4', data.formCategorysModel)
  try {
    const url = `/admin/packaging`;
    const res = await serverApi.post(url, data);
    return res.data;

  } catch (error: any) {
    const message =
      error?.response?.data?.message?.[0]?.title ||
      error?.response?.data?.message ||
      error?.response?.data ||
      'خطا در ثبت';

    throw new Error(message);
  }
}