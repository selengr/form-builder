import { AxiosApi } from '@/services/axios/AxiosApi';
import { useMutation } from '@tanstack/react-query';
import { IGetCategory } from './useGetParentCategory';

interface SubcategoryModel {
  parentId: string[];
}

const fetchSubcategoryData = async (parentId: string[]) => {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'PROJECTS',
    input: '',
    page: 0,
    rows: 1000,
  };

  const subcategoryModel: SubcategoryModel = {
    parentId: parentId,
  };

  const baseUrl = `/category/subcategory`;
  const queryString = `?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}&subcategoryModel=${encodeURIComponent(JSON.stringify(subcategoryModel))}`;

  const url = baseUrl + queryString;
  const response = await AxiosApi.get(url);
  return response.data;
};

export const useGetSubCategory = () => {
  const mutation = useMutation({
    mutationFn: (parentId: string[]) => fetchSubcategoryData(parentId),
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
