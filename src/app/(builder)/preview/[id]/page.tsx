'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import usePreview from '@/hooks/usePreview';
import { useEffect } from 'react';
import PreviewQuestion from '@/templates/preview/PreviewQuestion';
import PreviewProgress from '@/templates/preview/PreviewProgress';
import Loading from './loading';
import { Button, IconButton } from '@mui/material';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { ParticipateLoadingSkeleton } from '@/app/(participate)/form/[slug]/components/participateSkeleton';

export default function PreviewPage() {
  const router = useRouter();
  const { id: paramId } = useParams();
  const { status, title } = usePreview();
  const searchParams = useSearchParams();
  const search = searchParams.get('rep');
  const admin = search === 'list';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // if (status === 'loading') {
  //   return (
  //     <div className='w-full h-screen flex justify-center items-center bg-white'>
  //       <Loading />
  //     </div>
  //   );
  // }
  if (status === 'loading') return <ParticipateLoadingSkeleton />;

  if (status === 'notExist') {
    return (
      <div className='w-full h-screen flex justify-center items-center px-4'>
        <div className='max-w-md w-full bg-white rounded-xl shadow p-6 text-center'>
          <h2 className='text-xl font-bold text-red-600 mb-4'>هنوز سوالی ساخته نشده است</h2>
          <Button
            variant='contained'
            onClick={() => router.push(`/builder/${paramId}`)}
            sx={{
              backgroundColor: '#111',
              '&:hover': { backgroundColor: '#222' },
            }}>
            بازگشت به فرم ساز
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full flex flex-col overflow-hidden h-[calc(100dvh-76px)] md:h-screen p-2 sm:p-3`}>

      <div className={`flex flex-col bg-white rounded-xl overflow-hidden h-full shadow-sm`}>

        <div className='w-full h-[52px] flex items-center justify-center gap-4 rounded-lg bg-[#F7F7FF] px-2 mb-4 relative'>
          <IconButton sx={{ position: 'absolute', left: '8px' }} onClick={() => router.push(admin ? `/user-reports/${paramId}` : `/builder/${paramId}`)}>
            <MdOutlineKeyboardArrowRight color='#292D32' />
          </IconButton>
          <p className='text-[16px] text-center font-bold text-[#161616]'>{title}</p>
        </div>

        {/* Main content (centered 60%) */}
        <div className='flex-1 overflow-y-auto px-4'>
          <div className='w-full max-w-3xl mx-auto pb-6'>
            <PreviewQuestion />
          </div>
        </div>

        {/* Footer always at bottom */}
        <div className='shrink-0 w-full flex justify-between items-center px-2 py-4 rounded-xl'>
          <PreviewProgress />
        </div>
      </div>
    </div>
  );
}
