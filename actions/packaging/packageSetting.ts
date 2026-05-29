'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function getPackageSettingAction(id: number) {
  // try {
    const url = `/admin/packaging/${id}`

    const { data } = await serverApi.get(url);
    return data;
  // } catch (error: any) {
  //   const message =
  //     error?.response?.data?.message?.[0]?.title ||
  //     error?.response?.data?.message ||
  //     'انجام عملیات با خطا مواجه شد'

  //   throw new Error(message);
  // }
}


export async function putPackageSettingAction(
  id: number,
  payload: { name: string; ratio: number }
) {
  // try {
    const url = `/admin/packaging/${id}`;
    const response = await serverApi.put(url, payload);

    return response?.data;
  // } catch (error: any) {
  //   const message =
  //     error?.response?.data?.message?.[0]?.title ||
  //     error?.response?.data?.message ||
  //     'انجام عملیات با خطا مواجه شد'

  //   throw new Error(message);
  // }
}

export async function updatePackagingValidity(id: number, invalid: boolean) {
  // try {
    const url = `/admin/packaging/main-list/invalid`;
    const response = await serverApi.put(url, { id, invalid });

    return response?.data;
  // } catch (error: any) {
  //   const message =
  //     error?.response?.data?.message?.[0]?.title ||
  //     'خطا در تغییر وضعیت بسته'

  //   throw new Error(message);
  // }
}