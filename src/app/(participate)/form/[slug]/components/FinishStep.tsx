'use client';

import React from 'react';
import { Button } from '@mui/material';
import Image from 'next/image';
import AnimatedBox from '@/templates/form/AnimatedBox';
import finalStep from '@/../public/images/home-page/finalStep.svg';
import { Header } from './header';
import ReportDialog from '@/components/ReportDialog/ReportDialog';

interface FinishStepProps {
  formName: string;
  replace: (path: string) => void;
  isReportDialogOpen: boolean;
  handleOpenReportDialog: () => void;
  handleCloseReportDialog: () => void;
  formId: any;
}

export function FinishStep({ formName, replace, formId, isReportDialogOpen, handleOpenReportDialog, handleCloseReportDialog }: FinishStepProps) {
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
