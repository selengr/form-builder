import { useState, useCallback } from 'react';

interface UseStartFromContinueDialogProps {
  onConfirm: () => void;
  onStartNew: () => void;
}

export const useStartFromContinueDialog = ({
  onConfirm,
  onStartNew,
}: UseStartFromContinueDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    username: string | null;
  } | null>(null);

  const openDialog = useCallback((username: string | null) => {
    setPendingAction({ username });
    setIsDialogOpen(true);
  }, []);

  const handleConfirm = useCallback(() => {
    setIsDialogOpen(false);
    onConfirm();
    setPendingAction(null);
  }, [onConfirm]);

  const handleStartNew = useCallback(() => {
    setIsDialogOpen(false);
    onStartNew();
    setPendingAction(null);
  }, [onStartNew]);

  const handleClose = useCallback(() => {
    setIsDialogOpen(false);
    setPendingAction(null);
  }, []);

  return {
    isDialogOpen,
    openDialog,
    handleConfirm,
    handleStartNew,
    handleClose,
    pendingAction,
  };
};