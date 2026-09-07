import { useMutation } from '@tanstack/react-query';
import { createDataCollectionAction } from '@actions/data-collection/createDataCollectionAction';
import { FormSchemaType } from '../CreateDataCollectionBtn';

export async function createDataCollection(data: FormSchemaType) {
  const res = await createDataCollectionAction({
    name: data.name,
    targetPlatformEnum: data.targetPlatformEnum,
    label: data.label,
  });

  if (!res.success) {
    throw new Error(res.message || 'خطا در ثبت گروه.');
  }

  return res.data;
}

export function useCreateDataCollection() {
  return useMutation({
    mutationFn: createDataCollection,
  });
}
