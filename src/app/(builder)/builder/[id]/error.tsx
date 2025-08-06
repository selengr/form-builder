'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@mui/material';

export default function BuilderErrorPage({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='grow flex items-center justify-center bg-[#f9fafbaa]'>
      <div className='flex flex-col items-center gap-6 p-10 rounded-3xl bg-white shadow-2xl shadow-gray-300 max-w-md w-full'>
        <h2 className='text-gray-800 text-3xl font-semibold text-center font-iran-sans font-d6'>خطایی در بارگذاری سامانه رخ داده است</h2>
        <p className='text-gray-600 text-center text-base leading-relaxed font-iran-sans font-d6'>
          با عرض پوزش، در فرآیند بارگذاری فرم‌ساز مشکلی به وجود آمده است. لطفاً مجدداً تلاش نمایید یا در صورت تداوم مشکل، با تیم پشتیبانی تماس بگیرید.
        </p>
        <Button
          variant='contained'
          sx={{
            borderRadius: '14px',
            height: '56px',
            px: '24px',
            fontWeight: 'bold',
            backgroundColor: '#2563eb',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#1e40af',
            },
          }}>
          <Link href='/builder' className='text-white text-base no-underline'>
            بازشگت به فرم ساز
          </Link>
        </Button>
      </div>
    </div>
  );
}
