'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { CreatePackagingRequestFormValues } from './schema';
import { OwnershipTypeFieldLayout } from './ownershipTypeField.shared';

export { OWNERSHIP_SINGLE, OWNERSHIP_MULTI } from './ownershipTypeField.shared';
export type { OwnershipTypeEnum } from './ownershipTypeField.shared';

export default function OwnershipTypeField() {
  const { control, watch } = useFormContext<CreatePackagingRequestFormValues>();
  const ownershipTypeEnum = watch('ownershipTypeEnum');

  return (
    <Controller
      name="ownershipTypeEnum"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <OwnershipTypeFieldLayout
          value={field.value ?? ownershipTypeEnum}
          error={error?.message}
          onChange={field.onChange}
          showSampleDownload
        />
      )}
    />
  );
}
