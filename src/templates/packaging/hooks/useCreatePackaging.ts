import { useMutation } from '@tanstack/react-query';
import { getAuthToken } from '@/utils/getAuthToken';
import { PackaginigFormSchemaType } from '../CreatePackagingModal';

export async function createPackaging(
    data: PackaginigFormSchemaType
) {
    const token = await getAuthToken();
    const res = await fetch('/api/packaging', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
        let errorMessage = 'خطا در ثبت گروه.';

        if (Array.isArray(result?.error) && result.error[0]?.title) {
            errorMessage = result.error[0].title;
        } else if (typeof result?.error === 'string') {
            errorMessage = result.error;
        }

        throw new Error(errorMessage);
    }

    return result;
}

export function useCreatePackaging() {
    return useMutation({
        mutationFn: createPackaging,
    });
}
