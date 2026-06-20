'use client';

import { memo } from 'react';
import Dialog from '@mui/material/Dialog';
import { CgClose } from 'react-icons/cg';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Dispatch, SetStateAction, useState } from 'react';
// context
import { useUserInfoContext } from '@/context/UserInfoContext';
// hook
import { ILimitation, IStartFromContinu } from '@/hooks/useParticipateForm';
import { DialogTitle } from '@mui/material';
import { FiClock } from 'react-icons/fi';

interface StartFromContinueDialogProps {
    startFromContinue: IStartFromContinu,
    takePart: (username: string | null) => Promise<void>;
    setLimitation: Dispatch<SetStateAction<ILimitation>>;
    checkAnswerBefore: (username: string | null) => Promise<void>;
    setStartFromContinue: Dispatch<SetStateAction<IStartFromContinu>>;
}

const StartFromContinueDialog = memo(function StartFromContinueDialog({
    takePart,
    setLimitation,
    startFromContinue,
    checkAnswerBefore,
    setStartFromContinue

}: StartFromContinueDialogProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(startFromContinue.status);
    const router = useRouter()
    const { username } = useUserInfoContext();

    const onStartFromContinue = async () => {

        if (startFromContinue?.data?.loggedInStatus === false) {
            setLimitation({
                isLimited: true,
                limitationType: "PHONE_NUMBER",
            });
        } else {
            await checkAnswerBefore(username);
            setStartFromContinue({
                status: false,
                data: null
            })
            setIsDialogOpen(false)
        }
    }

    const onStartNew = async () => {

        await takePart(username);
        setStartFromContinue({
            status: false,
            data: null
        })
        setIsDialogOpen(false)

    }

    const onClose = () => {
        setIsDialogOpen(false)
        router.back()
    }

    return (
        <Dialog
            open={isDialogOpen}
            dir='rtl'
            sx={{
                overflow: 'hidden',
                scrollbarWidth: 'none',
                '& .MuiPaper-root': {
                    borderRadius: '24px',
                    margin: '10px',
                },
                '& .MuiDialog-container': {
                    backdropFilter: 'blur(4px)',
                    backgroundColor: 'hsl(0deg 0% 100% / 50%)',
                },
            }}>
            {isDialogOpen && (
                <>
                    <div className='flex items-center justify-end'>
                        <button className='mx-4 mt-4 mb-0' onClick={onClose}>
                            <CgClose color='#404040' width={25} height={25} size='1.5rem' />
                        </button>
                    </div>
                    <DialogContent
                        sx={{
                            paddingX: 3,
                            paddingBottom: 2,
                            paddingTop: 1,
                        }}>
                        <div className='text-right'>
                            <div className="flex items-center gap-2 justify-start mb-2">
                                <FiClock className="text-gray-500" />
                                <h3 className="text-lg font-bold text-gray-800">
                                    شروع از ادامه
                                </h3>
                            </div>

                            <p className="text-gray-600 leading-relaxed">

                                {
                                    startFromContinue.data.responseLimitation ?
                                        "در صورتی که ممکن است این فرم را نیمه‌کاره رها کنید و بخواهید بعد از بازگشت، از همان نقطه ادامه دهید؛ یا اینکه این همان فرمی است که قبلاً نیمه کاره رهایش کرده‌اید و می‌خواهید ادامه آن را تکمیل کنید، شماره تلفن همراه خود را در کادر زیر وارد کنید."
                                        :
                                        "اگر قبلاً این فرم را نیمه‌کاره رها کرده‌اید، می‌توانید ادامه آن را تکمیل کنید."
                                }
                            </p>
                        </div>
                    </DialogContent>
                    <DialogActions
                        sx={{
                            padding: '16px 24px',
                            gap: '4px',
                            // borderTop: '1px solid #e5e5e5',
                            display: "flex",
                            //   maxWidth : "250px"
                            justifyContent: "end"
                        }}>
                        {!startFromContinue.data.responseLimitation && (
                            <Button
                                onClick={onStartNew}
                                type='button'
                                fullWidth
                                className='text-[16px] text-[#1758BA]'
                                sx={{
                                    height: '45px',
                                    maxWidth: "130px",
                                    borderRadius: '10px',
                                    fontWeight: { xs: 500, md: 600 },
                                    fontSize: { xs: '14px', md: '15px' },
                                    color: '#1758BA',
                                    borderColor: '#1758BA',
                                    bgcolor: 'white',
                                    '&.MuiButtonBase-root:hover': {
                                        bgcolor: 'transparent',
                                        boxShadow: 'none',
                                        color: '#1758BA',
                                    },
                                }}
                                variant='outlined'
                            >
                                شروع فرم جدید
                            </Button>
                        )}
                        <Button
                            onClick={onStartFromContinue}
                            fullWidth
                            variant='contained'
                            sx={{
                                maxWidth: "150px",
                                bgcolor: '#1758BA',
                                height: '45px',
                                color: 'white',
                                fontSize: { xs: '14px', md: '15px' },
                                fontWeight: { xs: 500, md: 600 },
                                borderRadius: '10px',
                                boxShadow: 'none',
                                '&.MuiButtonBase-root:hover, &.MuiButtonBase-root:active': {
                                    bgcolor: '#1758BA',
                                    boxShadow: 'none',
                                },
                            }}>
                            {startFromContinue.data.responseLimitation ? "بله" : "ادامه فرم قبلی"}

                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
});

export default StartFromContinueDialog;