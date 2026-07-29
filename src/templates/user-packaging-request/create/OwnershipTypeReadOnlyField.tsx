'use client';

import { OwnershipTypeEnum, OwnershipTypeFieldLayout } from './ownershipTypeField.shared';

interface OwnershipTypeReadOnlyFieldProps {
  value?: OwnershipTypeEnum | string;
}

export default function OwnershipTypeReadOnlyField({ value }: OwnershipTypeReadOnlyFieldProps) {
  return <OwnershipTypeFieldLayout value={value} readOnly showSampleDownload={false} />;
}
