'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useGetUserPackagingRequestSubCategory } from './useGetUserPackagingRequestSubCategory';
import { UserPackagingRequestCategorySelectOption } from './useGetUserPackagingRequestParentCategory';
import { PackagingRequestDetail } from '../types';

type CategoryFormValues = {
  categoryIds: string[];
  subCategoryIds: string[];
};

function splitCategoryIds(
  allIds: string[],
  categories: UserPackagingRequestCategorySelectOption[] | undefined,
) {
  if (!allIds.length) {
    return { categoryIds: [] as string[], subCategoryIds: [] as string[] };
  }

  if (!categories?.length) {
    return { categoryIds: [] as string[], subCategoryIds: allIds };
  }

  const categoryIds = allIds.filter((id) =>
    categories.some((category) => category.value === id),
  );
  const subCategoryIds = allIds.filter((id) => !categoryIds.includes(id));

  return { categoryIds, subCategoryIds };
}

export function usePackagingRequestCategoryForm(
  requestId: number,
  data: PackagingRequestDetail | undefined,
  categories: UserPackagingRequestCategorySelectOption[] | undefined,
) {
  const formInitializedRef = useRef('');
  const subCategoriesFetchedRef = useRef('');
  const { mutation, subCategories } = useGetUserPackagingRequestSubCategory();

  const methods = useForm<CategoryFormValues>({
    defaultValues: {
      categoryIds: [],
      subCategoryIds: [],
    },
  });

  const { reset, watch } = methods;
  const watchCategoryIds = watch('categoryIds');
  const watchSubCategoryIds = watch('subCategoryIds');

  const savedCategoryIdsKey = data?.formCategorysModel?.categoryId?.join(',') ?? '';
  const categoriesKey = categories?.map((category) => category.value).join(',') ?? '';

  useEffect(() => {
    formInitializedRef.current = '';
    subCategoriesFetchedRef.current = '';
  }, [requestId]);

  useEffect(() => {
    if (!data) return;

    const allIds = data.formCategorysModel?.categoryId?.map(String) ?? [];
    const { categoryIds, subCategoryIds } = splitCategoryIds(allIds, categories);
    const initKey = `${data.id}:${savedCategoryIdsKey}:${categoriesKey}`;

    if (formInitializedRef.current === initKey) return;
    formInitializedRef.current = initKey;

    reset({ categoryIds, subCategoryIds });
  }, [data, savedCategoryIdsKey, categoriesKey, categories, reset]);

  useEffect(() => {
    if (!data || !categories?.length || !savedCategoryIdsKey) return;

    const allIds = savedCategoryIdsKey.split(',');
    const parentIds = allIds.filter((id) =>
      categories.some((category) => category.value === id),
    );
    if (!parentIds.length) return;

    const fetchKey = parentIds.join(',');
    if (subCategoriesFetchedRef.current === fetchKey) return;

    subCategoriesFetchedRef.current = fetchKey;
    mutation.mutate(parentIds);
  }, [data, savedCategoryIdsKey, categoriesKey, categories, mutation.mutate]);

  return {
    methods,
    watchCategoryIds,
    watchSubCategoryIds,
    subCategories,
    isFetchingSubCategory: mutation.isPending,
  };
}
