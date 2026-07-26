'use client';

import { memo, Dispatch, SetStateAction, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { FiClock } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';
import { useUserInfoContext } from '@/context/UserInfoContext';
import { ILimitation, IStartFromContinu } from '@/hooks/useParticipateForm';

interface StartFromContinueDialogProps {
  startFromContinue: IStartFromContinu;
  takePart: (username: string | null) => Promise<void>;
  setLimitation: Dispatch<SetStateAction<ILimitation>>;
  checkAnswerBefore: (username: string | null) => Promise<void>;
  setStartFromContinue: Dispatch<SetStateAction<IStartFromContinu>>;
}

const CONTINUE_INFO_TEXT = `می‌توانید فرم را نیمه‌کاره رها کنید و دوباره به آن برگردید!
این فرم به شما امکان می‌دهد در صورت وقفه، بعداً از همانجایی که آن را رها کرده‌اید ادامه دهید.
• اگر اولین بار است که این فرم را تکمیل می‌کنید، با وارد کردن شماره همراه، پاسخ‌های شما ذخیره می‌شود تا بعداً بتوانید ادامه دهید.
• اگر قبلاً این فرم را آغاز کرده‌اید، پاسخ‌های قبلی شما بازیابی خواهد شد.
وارد کردن شماره همراه اختیاری است، اما اگر احتمال می‌دهید کارتان نیمه‌تمام بماند، توصیه می‌کنیم شماره همراه خود را وارد کنید.`;

const PHONE_LIMITATION_TEXT =
  'برای پاسخ دادن به این فرم لازم است که شماره همراه خود را وارد کنید! برای جلوگیری از ثبت پاسخ تکراری لازم است شماره همراه شما ثبت شود. اگر قبلاً این فرم را تکمیل کرده باشید، امکان دسترسی مجدد نخواهید داشت.';

const StartFromContinueDialog = memo(function StartFromContinueDialog({
  takePart,
  setLimitation,
  startFromContinue,
  checkAnswerBefore,
  setStartFromContinue,
}: StartFromContinueDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(startFromContinue.status);
  const router = useRouter();
  const { username } = useUserInfoContext();

  const isPhoneLimitation = Boolean(startFromContinue.data?.responseLimitation);

  const onStartFromContinue = async () => {
    if (startFromContinue?.data?.loggedInStatus === false) {
      setLimitation({
        isLimited: true,
        limitationType: 'PHONE_NUMBER',
      });
    } else {
      await checkAnswerBefore(username);
      setStartFromContinue({
        status: false,
        data: null,
      });
      setIsDialogOpen(false);
    }
  };

  const onStartNew = async () => {
    await takePart(username);
    setStartFromContinue({
      status: false,
      data: null,
    });
    setIsDialogOpen(false);
  };

  const onClose = () => {
    setIsDialogOpen(false);
    router.back();
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={onClose}
      dir="ltr"
      sx={{
        overflow: 'hidden',
        scrollbarWidth: 'none',
        '& .MuiPaper-root': {
          borderRadius: '24px',
          margin: '10px',
          width: '100%',
          maxWidth: '480px',
          overflow: 'hidden',
        },
        '& .MuiDialog-container': {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'hsl(0deg 0% 100% / 50%)',
        },
      }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <IconButton aria-label="بستن" onClick={onClose} sx={{ m: 1, mt: 1.5 }}>
          <CgClose color="#404040" size="1.5rem" />
        </IconButton>
      </Box>

      <DialogContent
        dir="rtl"
        sx={{
          px: 3,
          pt: 0,
          pb: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '20px',
            bgcolor: '#EEF4FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}>
          <FiClock size={34} color="#1758BA" strokeWidth={2.25} />
        </Box>

        <Typography fontSize="18px" fontWeight={700} color="#161616" mb={2}>
          شروع از ادامه
        </Typography>

        <Box
          sx={{
            width: '100%',
            bgcolor: '#F7F7FF',
            borderRadius: '16px',
            px: 2.5,
            py: 2,
            mb: 3,
            textAlign: 'left',
          }}>
          <Typography fontSize="14px" fontWeight={700} color="#161616" mb={1}>
            توجه
          </Typography>
          <Typography fontSize="14px" fontWeight={500} color="#393939" lineHeight={1.9} whiteSpace="pre-line">
            {isPhoneLimitation ? PHONE_LIMITATION_TEXT : CONTINUE_INFO_TEXT}
          </Typography>
          <Box
            sx={{
              mt: 1.5,
              pt: 1.5,
              borderTop: '1px dashed #DDE1E6',
            }}>
            <Typography fontSize="13px" fontWeight={600} color="#1758BA">
              {isPhoneLimitation
                ? 'آیا مایل به ادامه با ثبت شماره همراه هستید؟'
                : 'چگونه می‌خواهید ادامه دهید؟'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
          {!isPhoneLimitation ? (
            <Button
              type="button"
              fullWidth
              variant="outlined"
              onClick={onStartNew}
              sx={{
                height: '50px',
                fontWeight: 700,
                fontSize: '15px',
                borderRadius: '10px',
                color: '#1758BA',
                borderColor: '#1758BA',
                bgcolor: 'white',
                boxShadow: 'none',
                '&:hover': { bgcolor: 'white', boxShadow: 'none' },
              }}>
              شروع فرم جدید
            </Button>
          ) : (
            <Button
              type="button"
              fullWidth
              variant="outlined"
              onClick={onClose}
              sx={{
                height: '50px',
                fontWeight: 700,
                fontSize: '15px',
                borderRadius: '10px',
                color: '#1758BA',
                borderColor: '#1758BA',
                bgcolor: 'white',
                boxShadow: 'none',
                '&:hover': { bgcolor: 'white', boxShadow: 'none' },
              }}>
              انصراف
            </Button>
          )}

          <Button
            type="button"
            fullWidth
            variant="contained"
            disableElevation
            onClick={onStartFromContinue}
            sx={{
              height: '50px',
              fontWeight: 700,
              fontSize: '15px',
              borderRadius: '10px',
              bgcolor: '#1758BA',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1758BA', opacity: 0.92, boxShadow: 'none' },
            }}>
            {isPhoneLimitation ? 'بله، ادامه' : 'ادامه فرم قبلی'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
});

export default StartFromContinueDialog;
