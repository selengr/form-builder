'use client';

import React from 'react';
import { Button } from '@mui/material';
import Image from 'next/image';
import AnimatedBox from '@/templates/form/AnimatedBox';
import errorStep from '@/../public/images/home-page/errorStep.svg';

interface ErrorStepProps {
  message: string;
  replace: (path: string) => void;
}

export function ErrorStep({ message, replace }: ErrorStepProps) {
  return (
    <div className='w-full flex flex-col p-4 overflow-hidden'>
      <div className='flex flex-col bg-white rounded-xl h-full max-h-screen'>
        <div className='flex-1 flex items-center justify-center overflow-y-auto px-4'>
          <div className='w-full max-w-3xl'>
            <AnimatedBox>
              <div className='w-full flex flex-col items-center justify-center gap-4 text-center'>
                <p className='text-xl font-bold text-red-400 mb-4'>{message}</p>

                <div className='w-full max-w-xs sm:max-w-md'>
                  <Image src={errorStep} alt='خطا' width={400} height={400} priority className='w-full h-auto max-h-[400px] object-contain' draggable={false} />
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
    </div>
  );
}

export default ErrorStep;
