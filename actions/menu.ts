'use server';
import { serverApi } from '@/services/axios/serverApi';
import { IMenuResponseData } from '@/components/MiddleSidebar/type';

export async function fetchMenuServer(): Promise<IMenuResponseData> {
  try {
    const response = await serverApi.get('/authorization-psya/front-panel/non-org-user-role/find-user-loggedin-info',{
       baseURL: process.env.BASE_URL,
    });
    return response.data
  } catch (err) {
    throw err;
  }
}
