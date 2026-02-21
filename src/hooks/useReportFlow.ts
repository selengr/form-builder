import { fetchUserInfo } from '@/lib/auth';
import { useState, useCallback } from 'react';
import { useLoginWithPhone } from '@/hooks/useLoginWithPhone';
// actions
// import { fetchUserInfoServer } from '../../actions/auth';

type DialogState = 'none' | 'login' | 'report';

export function useReportFlow() {
  const [dialogState, setDialogState] = useState<DialogState>('none');
  const { formValue, error, helperText, reset, handleChange, handleSubmit } =
    useLoginWithPhone('');

  const handleReportDialog = useCallback(async () => {
    const { userInfo } = await fetchUserInfo();
    const username = userInfo?.user?.username || null;
    setDialogState(username ? 'report' : 'login');
  }, []);

  const handleLoginSubmit = useCallback(() => {
    if (handleSubmit()) {
      setDialogState('report');
    }
  }, [handleSubmit]);

  const handleCloseReport = useCallback(() => {
    reset();
    setDialogState('none');
  }, [reset]);

  return {
    dialogState,
    setDialogState,
    formValue,
    error,
    helperText,
    handleChange,
    handleReportDialog,
    handleLoginSubmit,
    handleCloseReport,
  };
}
