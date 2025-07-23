import { toast } from 'sonner';
import { AxiosApi } from '@/services/axios/AxiosApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TTicketFormData } from '../_component/ChangeStatusDialog';


const postChangeStatus = async (data: TTicketFormData) => {
    const url = `/admin/form/change-status`;
    const response = await AxiosApi.post(url, data);
    return response.data;
};

export const usePostChangeStatus = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationKey: ['change-status'],
        mutationFn: ({ data }: { data: TTicketFormData }) => postChangeStatus(data),

        onSuccess: () => {
            // queryClient.invalidateQueries([''] as any);
            // queryClient.refetchQueries(['']as any);
            toast.success(`با موفقیت انجام شد`);
        },
        onError: () => {
            toast.error("انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.");
        },
    });

    return mutation;
};
