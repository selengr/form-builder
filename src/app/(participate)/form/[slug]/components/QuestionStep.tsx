'use client';

import React from 'react';
import { useState } from 'react';
import AnimatedBox from '@/templates/form/AnimatedBox';
import ActionButtons from '@/templates/form/ActionButtons';
import ReportDialog from '@/components/ReportDialog/ReportDialog';
import Header from '@/app/(participate)/form/[slug]/components/header';
import LoginWithPhone from '@/components/common/loginWithPhone';
import { fetchUserInfo } from '@/lib/auth';
import { useLoginWithPhone } from '@/hooks/useLoginWithPhone';
import { useReportFlow } from '@/hooks/useReportFlow';

interface QuestionStepProps {
  question: any;
  formName: string;
  formData: any;
  ValidatedInput: any;
  handleValidationUpdate: any;
  handleNext: () => void;
  handlePrev: () => void;
  questionLoading: boolean;
  prevBlock: boolean;
  isReportDialogOpen: boolean;
  handleOpenReportDialog: () => void;
  handleCloseReportDialog: () => void;
  formId: any;
  replace: (path: string) => void;
}

type DialogState = 'none' | 'login' | 'report';

export function QuestionStep({
  question,
  formName,
  formData,
  ValidatedInput,
  handleValidationUpdate,
  handleNext,
  handlePrev,
  questionLoading,
  isReportDialogOpen,
  handleOpenReportDialog,
  handleCloseReportDialog,
  formId,
  replace,
  prevBlock,
}: QuestionStepProps) {
   const {
    dialogState,
    formValue,
    error,
    helperText,
    handleChange,
    handleReportDialog,
    handleLoginSubmit,
    handleCloseReport,
    setDialogState,
  } = useReportFlow();

  // const handleReportDialog = async () => {
  //   const { userInfo } = await fetchUserInfo();
  //   const username = userInfo?.user?.username || null;

  //   if (username) {
  //     setDialogState('report');
  //     handleOpenReportDialog()
  //   } else {
  //     setDialogState('login');
  //   }
  // };

  // const parentSubmit = () => {
  //   if (handleSubmit()) {
  //     setDialogState('report');
  //     handleOpenReportDialog()
  //   }
  // };

  // const handleCloseReport = () => {
  //   if (handleSubmit()) {
  //     reset()
  //   }
  //   handleCloseReportDialog()
  //   setDialogState('none')
  // };

  return (
    <div className='w-full flex flex-col p-4 overflow-hidden'>
      <div className='flex flex-col bg-white rounded-xl h-[calc(100vh-120px)] md:h-full max-h-screen'>
        {/* Header */}
        <Header formName={formName} handleOpenReportDialog={handleReportDialog} replace={replace} />

        {/* Main Content */}
        <div className='flex-1 overflow-y-auto px-4'>
          <div className='w-full max-w-3xl mx-auto pb-6'>
            {question && (
              <AnimatedBox key={question.questionId}>
                <ValidatedInput key={question.id} formData={formData} elementInstance={question} onValidationUpdate={false ? () => { } : handleValidationUpdate} />
              </AnimatedBox>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='shrink-0 w-full flex justify-between items-center px-2 py-4 rounded-xl'>
          <ActionButtons loadingNext={questionLoading} disablePrev={prevBlock || questionLoading} nextAction={handleNext} prevAction={handlePrev} />
        </div>
      </div>


      {dialogState === 'login' && (
        <LoginWithPhone
          open
          onClose={() => setDialogState('none')}
          label={'شماره موبایل'}
          placeholder={'09129876543'}
          formValue={formValue}
          error={error}
          helperText={helperText}
          onChange={handleChange}
          onSubmit={handleLoginSubmit}
        />
      )}

      {/* دیالوگ گزارش */}
      {dialogState === 'report' && (
        <ReportDialog
          userPhone={formValue}
          questionId={question?.questionId}
          open
          onClose={handleCloseReport}
          formId={formId}
          typeOfReport={'FORM'}
        />
      )}

    </div>
  );
}

export default QuestionStep;
