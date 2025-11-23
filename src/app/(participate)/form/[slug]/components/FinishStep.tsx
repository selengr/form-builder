'use client';

import Image from 'next/image';
import { Button } from '@mui/material';
import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
// templates
import AnimatedBox from '@/templates/form/AnimatedBox';
// images
import finalStep from '@/../public/images/home-page/finalStep.svg';
// components
import { Header } from './header';
import LoginWithPhone from '@/components/common/loginWithPhone';
import ReportDialog from '@/components/ReportDialog/ReportDialog';
import BuilderLoading from '@/app/(builder)/builder/[id]/loading';
// hooks
import { useReportFlow } from '@/hooks/useReportFlow';
import { useShowResultUser } from '../show-result/hooks/useShowResultUser';

interface FinishStepProps {
  question: any;
  showReportForResponder: boolean | null;
  formName: string;
  takePartId: number;
  replace: (path: string) => void;
  formId: any;
}

export function FinishStep({ question, showReportForResponder, takePartId, formName, replace, formId }: FinishStepProps) {
  const searchParams = useSearchParams();
  const surveyParam = searchParams.get("survey");
  const { mutate, isPending } = useShowResultUser();
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

  useEffect(() => {
    if (showReportForResponder) {
      mutate({
        data: { formId: question.formId, takePartId },
        name: formName,
      });
    }
  }, [question.formId, takePartId])

  if (isPending) return <BuilderLoading />;
  if (showReportForResponder) return null

  return (
    <div className='w-full flex flex-col p-4 overflow-hidden'>
      <div className='flex flex-col bg-white rounded-xl h-[calc(100vh-120px)] md:h-full max-h-screen'>
        <Header surveyParam={surveyParam} handleOpenReportDialog={handleReportDialog} replace={replace} formName={'پایان'} />

        <div className='flex-1 flex items-center justify-center overflow-y-auto px-4'>
          <div className='w-full max-w-3xl'>
            <AnimatedBox>
              <div className='w-full flex flex-col items-center justify-center gap-4 text-center'>
                <p className='text-lg font-semibold leading-relaxed'>
                  پاسخ‌های شما به <span className='text-xl font-bold'>«{formName}»</span> با موفقیت ثبت شد.
                </p>

                <div className='w-full max-w-xs sm:max-w-md'>
                  <Image src={finalStep} alt='نتیجه' width={400} height={400} priority className='w-full h-auto max-h-[400px] object-contain' draggable={false} />
                </div>

                <Button
                  sx={{
                    width: '150px',
                    height: '52px',
                    borderRadius: '10px',
                    backgroundColor: '#1758BA',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#1758BA',
                      boxShadow: 'none',
                    },
                  }}
                  variant='contained'
                  onClick={() => replace('/')}>
                  بازگشت
                </Button>
              </div>
            </AnimatedBox>
          </div>
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

export default FinishStep;
