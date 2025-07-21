import { toast } from 'sonner';
import {  useRouter } from "next/navigation";
import { useMutation } from '@tanstack/react-query';
import { AxiosApi } from '@/services/axios/AxiosApi';


const postCalculation = async (data: { formId: number; takePartId: number }[]) => {
    const url = '/report/solo/show-solo-report';
    const response = await AxiosApi.post(url, data);
    return response.data;
};

export const usePostCondition = () => {
    const { push } = useRouter()

    const mutation = useMutation({
        mutationKey: ['post-condition'],
        mutationFn: ({ data }: { data: { formId: number; takePartId: number }[] }) => postCalculation(data),

        onSuccess: (formId,data) => {
            console.log('formId, data', formId, data)
             push(`/stats/${formId}/show-result`);
        },
        onError: () => {
            toast.error("عملیات ناموفق بود مجددا تلاش کنید");
        },
    });

    return mutation;
};