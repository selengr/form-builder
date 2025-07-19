import { toast } from 'sonner';
import { AxiosApi } from '@/services/axios/AxiosApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';


const postCalculation = async (data: { formId: number; takePartId: number }[]) => {
    const url = '/report/solo/show-solo-report';
    const response = await AxiosApi.post(url, data);
    return response.data;
};

export const usePostCondition = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationKey: ['post-condition'],
        mutationFn: ({ data }: { data: { formId: number; takePartId: number }[] }) => postCalculation(data),

        onSuccess: () => {
            queryClient.invalidateQueries(['Report_List'] as any);
            queryClient.refetchQueries(['Report_List'] as any);
            toast.success("خرده‌گزارش با موفقیت ایجاد شد");
        },
        onError: () => {
            toast.error("عملیات ناموفق بود مجددا تلاش کنید");
        },
    });

    return mutation;
};