'use client';

import { memo } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { CgClose } from 'react-icons/cg';

interface StartFromContinueDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onStartNew: () => void;
}

const StartFromContinueDialog = memo(function StartFromContinueDialog({
    open,
    onClose,
    onConfirm,
    onStartNew,
}: StartFromContinueDialogProps) {
    return (
        <Dialog
            open={open}
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
            {open && (
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
                            <h2 className='text-xl font-bold mb-3 text-gray-800'>
                                ادامه از پاسخ‌های قبلی
                            </h2>
                            <p className='text-gray-600 mb-6 leading-relaxed'>
                                شما قبلاً شروع به پاسخگویی به این فرم کرده‌اید.
                                آیا می‌خواهید از جایی که متوقف شده‌اید ادامه دهید یا از ابتدا شروع کنید؟
                            </p>
                        </div>
                    </DialogContent>
                    <DialogActions
                        sx={{
                            padding: '16px 24px',
                            gap: '12px',
                            // borderTop: '1px solid #e5e5e5',
                            display: "flex",
                            //   maxWidth : "250px"
                            justifyContent: "end"
                        }}>
                        <Button
                            onClick={onStartNew}
                            type='button'
                            fullWidth
                            className='text-[16px] text-[#1758BA]'
                            sx={{
                                height: '50px',
                                maxWidth: "120px",
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
                            شروع از ابتدا
                        </Button>
                        <Button
                            onClick={onConfirm}
                            fullWidth
                            variant='contained'
                            sx={{
                                maxWidth: "170px",
                                bgcolor: '#1758BA',
                                height: '50px',
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
                            ادامه از پاسخ‌های قبلی
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
});

export default StartFromContinueDialog;