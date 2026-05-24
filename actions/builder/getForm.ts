'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function fetchFormData(id: string) {
    const res: any = await serverApi.get(`/api/builder/${id}`);
    return res.data
}