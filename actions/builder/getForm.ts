'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function getFormDataAction(id: string) {
    // await new Promise((resolve)=> setTimeout(() => resolve, 500))
    const response = await serverApi.get(`/form/${id}`);
    return response.data;
}