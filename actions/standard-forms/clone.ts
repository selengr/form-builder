'use server';

import { serverApi } from "@/services/axios/serverApi";

export async function createPackageAction(id: number) {
  try {
    const url = `/psya/user/packaging/clone`;
    const res = await serverApi.post(url, id);
    return res.data;

  } catch (error: any) {
    const message =
      error?.response?.data?.message?.[0]?.title ||
      error?.response?.data?.message ||
      'خطا در ثبت';

    throw new Error(message);
  }
}