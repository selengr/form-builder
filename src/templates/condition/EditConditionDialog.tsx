'use client';

import { IEditConditionDialogProps } from '@/types/condition';
import ConditionDialogShell from './ConditionDialogShell';
import { ConditionalSystem } from './ConditionalSystem';

export const EditConditionDialog: React.FC<IEditConditionDialogProps> = ({
  open,
  setOpen,
  condition,
}) => {
  const handleClose = () => setOpen(false);

  return (
    <ConditionDialogShell open={open} onClose={handleClose}>
      <ConditionalSystem handleClose={handleClose} condition={condition} isEdit />
    </ConditionDialogShell>
  );
};

export default EditConditionDialog;
