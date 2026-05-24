'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function getFormDataAction(id: string) {
    const response = await serverApi.get(`/form/${id}`);
    return response.data;
}