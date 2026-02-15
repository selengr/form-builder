import { useMutation } from '@tanstack/react-query';
import { IGetCategory } from './useGetParentCategory';
import { getSubcategoryAction } from '../../../../actions/builder/getSubcategory';

interface SubcategoryModel {
  parentId: string[];
}

export const useGetSubCategory = () => {
  const mutation = useMutation({
    mutationFn: (parentId: string[]) => getSubcategoryAction(parentId),
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
