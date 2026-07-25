'use client';

import { ICreateConditionDialogProps } from '@/types/condition';
import ConditionDialogShell from './ConditionDialogShell';
import { ConditionalSystem } from './ConditionalSystem';

export const CreateConditionDialog: React.FC<ICreateConditionDialogProps> = ({
  open,
  setOpen,
}) => {
  const handleClose = () => setOpen(false);

  return (
    <ConditionDialogShell open={open} onClose={handleClose}>
      <ConditionalSystem handleClose={handleClose} />
    </ConditionDialogShell>
  );
};

export default CreateConditionDialog;
