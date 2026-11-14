import Image from 'next/image';
import { Button, IconButton } from '@mui/material';

import ActionButtons from '@/templates/form/ActionButtons';
import BugIcon from '@/../public/images/home-page/menu/bugIcon.svg';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

export const ParticipateLoadingSkeleton = ({ firstload, isPreview }: { firstload?: boolean; isPreview?: boolean }) => {

    return (
        <div className={`w-full flex flex-col overflow-hidden h-[calc(100dvh-76px)] md:h-screen p-2 sm:p-3`}>
            <div className={`flex flex-col bg-white rounded-xl overflow-hidden h-full shadow-sm`}>

                <div className='shrink-0 flex items-center justify-center gap-4 bg-[#F7F7FF] rounded-lg px-4 py-4 mb-4 relative m-2 z-10'>

                    {firstload && <div className="w-6 h-6 right-2 absolute bg-gray-200 rounded-full animate-pulse"></div>}
                    {!firstload &&
                        <IconButton sx={{ position: 'absolute', left: { xs: '2px', sm: '8px' }, top: '50%', transform: 'translateY(-50%)' }}>
                            <MdOutlineKeyboardArrowRight color='#292D32' />
                        </IconButton>
                    }

                    <div className="px-12 mx-5 flex items-center justify-center w-full">
                        <div className="h-5 w-40 sm:w-48 md:w-56 rounded-full bg-gray-200 animate-pulse max-w-full" />
                    </div>

                    {!isPreview &&
                        <Button
                            size="medium"
                            className="rounded-full"
                            sx={{ position: 'absolute', right: { xs: '2px', sm: '8px' }, top: '50%', transform: 'translateY(-50%)' }}
                            endIcon={
                                <div className="relative w-[18px] h-[18px] sm:w-[24px] sm:h-[24px]">
                                    <Image
                                        alt="report"
                                        src={BugIcon}
                                        fill
                                        className="object-contain"
                                        unoptimized
                                    />
                                </div>
                            }
                        >
                            <span className="text-xs">گزارش</span>
                        </Button>
                    }
                </div>

                <div className='flex-1 overflow-y-auto px-4'>
                    <div className='w-full max-w-3xl mx-auto pb-6'>
                        <div className='w-[99%] my-4 md:my-8 p-6 md:p-12 flex'>
                            <QuestionFieldSkeleton />
                        </div>
                    </div>
                </div>

                <div className='shrink-0 w-full flex justify-between items-center p-3 rounded-xl'>
                    <ActionButtons disableNext={firstload ? true : false} disablePrev={true} />
                </div>
            </div>
        </div>
    );
};


function SkeletonBlock({ className = '' }: { className?: string }) {
    return <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />;
}

function OptionSkeleton({ width }: { width: string }) {
    return (
        <div dir='rtl' className='flex items-center gap-3 h-[52px] w-full px-4 rounded-xl border border-[#E8E8E8] bg-white'>
            <SkeletonBlock className='h-5 w-5 shrink-0 rounded-full bg-gray-100' />
            <SkeletonBlock className={`h-3.5 rounded-md ${width}`} />
        </div>
    );
}

const QuestionFieldSkeleton = () => {
    return (
        <div dir='rtl' className='flex flex-col w-full max-w-[600px]'>
            <div className='flex flex-col gap-2.5'>
                <SkeletonBlock className='h-5 w-4/5 md:w-3/5 rounded-md' />
                <SkeletonBlock className='h-5 w-1/2 md:w-2/5 rounded-md' />
            </div>
            <SkeletonBlock className='h-3.5 w-2/3 md:w-1/2 mt-3 rounded-md bg-gray-100' />

            <div className='flex flex-col gap-3 mt-7'>
                <OptionSkeleton width='w-2/5' />
                <OptionSkeleton width='w-1/2' />
                <OptionSkeleton width='w-1/3' />
            </div>
        </div>
    );
};
