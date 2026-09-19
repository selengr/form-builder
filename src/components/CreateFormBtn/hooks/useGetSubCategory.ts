import { useMutation } from '@tanstack/react-query';
import { IGetCategory } from './useGetParentCategory';
import { getSubcategoryAction } from '@actions/builder/getSubcategory';

export const useGetSubCategory = () => {
  const mutation = useMutation({
    mutationFn: async (parentId: string[]) => {
      const res = await getSubcategoryAction(parentId);
      if (!res.success) {
        throw new Error(res.message || 'خطا در دریافت زیردسته');
      }
      return res.data;
    },
  });

  const SubCategoryData = (data: any) => {
    return data?.dataList?.map((item: IGetCategory) => ({
      value: item.value,
      label: item.caption,
    }));
  };

  return {
    mutation,
    SubCategoryData,
  };
};
