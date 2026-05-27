import Image from 'next/image';
import { Box, Skeleton, Button, IconButton } from '@mui/material';

import ActionButtons from '@/templates/form/ActionButtons';
import BugIcon from '@/../public/images/home-page/menu/bugIcon.svg';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

export const ParticipateLoadingSkeleton = ({ firstload }: { firstload?: boolean }) => {

    return (
        <div className={`w-full flex flex-col overflow-hidden p-4`}>
            <div className={`flex flex-col bg-white rounded-xl md:h-full max-h-screen h-[100vh]`}>

                <div className='shrink-0 flex items-center justify-center gap-4 bg-[#F7F7FF] rounded-lg px-4 py-4 mb-4 relative m-2 z-10'>

                    {firstload && <div className="w-6 h-6 right-2 absolute bg-gray-200 rounded-full animate-pulse"></div>}
                    {!firstload &&
                        <IconButton sx={{ position: 'absolute', left: '8px' }}>
                            <MdOutlineKeyboardArrowRight color='#292D32' />
                        </IconButton>
                    }
                    <p className='text-base font-bold text-[#161616] text-center -mr-5'>
                        <div className="h-6 bg-gray-200 rounded-sm md:w-44 w-24 animate-pulse"></div>
                    </p>

                    <Button size='medium' className='rounded-full' sx={{ position: 'absolute', right: '8px' }} endIcon={<Image alt='report' src={BugIcon} height={24} width={24} />}>
                        <span className='text-xs'>گزارش</span>
                    </Button>
                </div>

                <div className='flex-1 overflow-y-auto px-4'>
                    <div className='w-full max-w-3xl mx-auto pb-6 animate-pulse'>
                        <Box display='flex' gap={2} flexDirection='column' width='100%' maxWidth='600px'>

                            <Box sx={{ mt: 10, px: 6 }} className={`
                                    w-[99%] h-full
                                    rounded-2full mt-8 p-6
                                    `}>
                                <Skeleton
                                    variant="rectangular"
                                    height={56}
                                    sx={{ borderRadius: 1 }}
                                />

                                <Box sx={{ mt: 5 }}>
                                    <Skeleton variant="text" width="95%" height={16} />
                                    <Skeleton variant="text" width="80%" height={16} />
                                </Box>
                                <Skeleton variant="text" width="70%" height={14} sx={{ mt: 0.5 }} />
                            </Box>
                        </Box>
                    </div>
                </div>

                <div className='shrink-0 w-full flex justify-between items-center px-2 py-4 rounded-xl'>
                    <ActionButtons disableNext={firstload ? true : false} disablePrev={true} />
                </div>
            </div>
        </div>
    );
};