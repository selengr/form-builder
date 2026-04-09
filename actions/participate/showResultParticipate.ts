'use server';

import { serverApi } from '@/services/axios/serverApi';

export async function showResultParticipate(
    data: { formId: number; takePartId: number }
) {
    try {
        const url = '/report/user/solo/show-solo-report';
        const response = await serverApi.post(url, data);
        return response.data;
    } catch (error: any) {
        const message =
            error?.response?.data?.message?.[0]?.title ||
            error?.response?.data?.message ||
            error?.response?.data ||
            error?.message ||
            'خطای نامشخص';

        throw new Error(message);
    }
}
