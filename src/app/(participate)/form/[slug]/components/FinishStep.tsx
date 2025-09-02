'use client';

import Image from 'next/image';
import { Button } from '@mui/material';
import React, { useEffect } from 'react';
// components
import { Header } from './header';
import AnimatedBox from '@/templates/form/AnimatedBox';
import ReportDialog from '@/components/ReportDialog/ReportDialog';
import finalStep from '@/../public/images/home-page/finalStep.svg';
import { useShowResultUser } from '../show-result/hooks/useShowResultUser';

interface FinishStepProps {
  question: any;
  formName: string;
  takePartId: number;
  replace: (path: string) => void;
  isReportDialogOpen: boolean;
  handleOpenReportDialog: () => void;
  handleCloseReportDialog: () => void;
  formId: any;
}

export function FinishStep({ question, takePartId, formName, replace, formId, isReportDialogOpen, handleOpenReportDialog, handleCloseReportDialog }: FinishStepProps) {
  const { mutate } = useShowResultUser();
  
  useEffect(() => {
    if (question?.showReportForResponder) {
      mutate({
        data: { formId: question.formId, takePartId },
        name: formName,
      });
    }
  }, [])

  return (
    <div className='w-full flex flex-col p-4 overflow-hidden'>
      <div className='flex flex-col bg-white rounded-xl h-[calc(100vh-120px)] md:h-full max-h-screen'>
        <Header handleOpenReportDialog={handleOpenReportDialog} replace={replace} formName={'پایان'} />

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
      <ReportDialog open={isReportDialogOpen} onClose={handleCloseReportDialog} formId={formId} typeOfReport={'FORM'} />
    </div>
  );
}

export default FinishStep;
