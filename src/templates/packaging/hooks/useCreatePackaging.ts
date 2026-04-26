import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { createPackageAction } from '../../../../actions/packaging/create';

interface FormCategoryModel {
    categoryId: string[];
}
export interface IPayloadPackage {
    name: string;
    targetLabelEnum: string;
    formCategorysModel: FormCategoryModel;
}
// ---------------------------------------------------------------------------

export function useCreatePackaging({ push, onClose }: { push: any; onClose: () => void }) {

    return useMutation({
        mutationFn: ({ data }: { data: IPayloadPackage }) => createPackageAction(data),
        onSuccess: (result) => {
            toast.success('عملیات با موفقیت انجام شد');
            onClose()
            push(`/builder/${result.formId}?admin=packaging`);
        },
        onError: (error: any) => {
            toast.error(error?.message || 'خطا در ایجاد فرم');
        },
    });
}
