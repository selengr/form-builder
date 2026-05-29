import Image from 'next/image';
import { Box, Skeleton, Button, IconButton } from '@mui/material';

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
                        <div className="h-6 w-40 sm:w-48 md:w-64 rounded-md bg-gray-200 animate-pulse max-w-full" />
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
                                    />
                                </div>
                            }
                        >
                            <span className="text-xs">گزارش</span>
                        </Button>
                    }
                </div>

                <div className='flex-1 overflow-y-auto px-4'>
                    <div className='w-full max-w-3xl mx-auto pb-6 animate-pulse'>
                        <div
                            className={`
                                w-full h-full
                                flex items-center
                                rounded-xl
                                my-8 p-8 md:p-12
                            `}
                            >
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


const QuestionFieldSkeleton = () => {
    return (
        <Box display='flex' gap={1.5} flexDirection='column' width='100%' maxWidth='600px'>
            <Box display='flex' flexDirection='column' gap={0.5} width='100%'>
                <Skeleton variant="text" sx={{ width: { xs: "80%", md: "60%", borderRadius: 1 } }} height={24} />
                <Skeleton variant="text" sx={{ width: { xs: "50%", md: "20%", borderRadius: 1 } }} height={16} />
            </Box>

            <Skeleton
                variant="rectangular"
                width="100%"
                height={50}
                sx={{
                    borderRadius: '12px',
                    bgcolor: 'rgba(0,0,0,0.06)',
                }}
            />

            <Skeleton variant="text" sx={{ width: { xs: "65%", md: "40%", borderRadius: 1 } }} height={16} />
        </Box>
    );
};