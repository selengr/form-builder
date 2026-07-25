'use client';

import CreateCalculatorDialog from '@/templates/calculator/CreateCalculatorDialog';
import EditCalculatorDialog from '@/templates/calculator/EditCalculatorDialog';
import CreateConditionDialog from '@/templates/condition/CreateConditionDialog';
import { EditConditionDialog } from '@/templates/condition/EditConditionDialog';
import { LogicFormState } from './types';

interface LogicFormDialogsProps {
  formState: LogicFormState;
  onClose: () => void;
}

export default function LogicFormDialogs({ formState, onClose }: LogicFormDialogsProps) {
  if (!formState) return null;

  if (formState.type === 'calculator' && formState.mode === 'create') {
    return (
      <CreateCalculatorDialog
        open
        setOpen={(open) => {
          if (!open) onClose();
        }}
      />
    );
  }

  if (formState.type === 'calculator' && formState.mode === 'edit') {
    return (
      <EditCalculatorDialog
        open
        calcId={formState.id}
        setOpen={(open) => {
          if (!open) onClose();
        }}
      />
    );
  }

  if (formState.type === 'condition' && formState.mode === 'create') {
    return (
      <CreateConditionDialog
        open
        setOpen={(open) => {
          if (!open) onClose();
        }}
      />
    );
  }

  if (formState.type === 'condition' && formState.mode === 'edit') {
    return (
      <EditConditionDialog
        open
        condition={formState.condition}
        setOpen={(open) => {
          if (!open) onClose();
        }}
      />
    );
  }

  return null;
}
