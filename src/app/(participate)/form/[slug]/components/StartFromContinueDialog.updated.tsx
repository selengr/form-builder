'use client';

import { memo, Dispatch, SetStateAction, useMemo, useState } from 'react';
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
import {
  getStartFromContinueModalContent,
  START_FROM_CONTINUE_COPY,
} from './startFromContinueScenarios';

interface StartFromContinueDialogUpdatedProps {
  startFromContinue: IStartFromContinu;
  takePart: (username: string | null) => Promise<void>;
  setLimitation: Dispatch<SetStateAction<ILimitation>>;
  checkAnswerBefore: (username: string | null) => Promise<void>;
  setStartFromContinue: Dispatch<SetStateAction<IStartFromContinu>>;
}

const StartFromContinueDialogUpdated = memo(function StartFromContinueDialogUpdated({
  takePart,
  setLimitation,
  startFromContinue,
  checkAnswerBefore,
  setStartFromContinue,
}: StartFromContinueDialogUpdatedProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(startFromContinue.status);
  const router = useRouter();
  const { username } = useUserInfoContext();

  const data = startFromContinue.data;
  const content = useMemo(
    () =>
      getStartFromContinueModalContent({
        loggedInStatus: data?.loggedInStatus,
        responseLimitation: data?.responseLimitation,
        startFromContinue: true,
      }),
    [data?.loggedInStatus, data?.responseLimitation],
  );

  const closeDialogState = () => {
    setStartFromContinue({ status: false, data: null });
    setIsDialogOpen(false);
  };

  const openPhoneLimitation = () => {
    setLimitation({
      isLimited: true,
      limitationType: (data?.responseLimitation as ILimitation['limitationType']) || 'PHONE_NUMBER',
    });
  };

  const onPrimary = async () => {
    switch (content.primary.action) {
      case 'enter_phone':
      case 'confirm_limitation':
        // Guest / required-phone → FormLimitation (OTP) flow
        if (data?.loggedInStatus === false) {
          openPhoneLimitation();
          return;
        }
        // Logged-in + limitation confirm → continue previous answers
        await checkAnswerBefore(username);
        closeDialogState();
        return;
      case 'continue_previous':
        if (data?.loggedInStatus === false) {
          openPhoneLimitation();
          return;
        }
        await checkAnswerBefore(username);
        closeDialogState();
        return;
      default:
        return;
    }
  };

  const onSecondary = async () => {
    switch (content.secondary.action) {
      case 'skip_enter':
      case 'start_new':
        await takePart(username);
        closeDialogState();
        return;
      case 'cancel':
        setIsDialogOpen(false);
        router.back();
        return;
      default:
        return;
    }
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
          {START_FROM_CONTINUE_COPY.dialogTitle}
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
            {START_FROM_CONTINUE_COPY.attentionTitle}
          </Typography>
          <Typography fontSize="14px" fontWeight={500} color="#393939" lineHeight={1.9} whiteSpace="pre-line">
            {content.body}
          </Typography>
          <Box
            sx={{
              mt: 1.5,
              pt: 1.5,
              borderTop: '1px dashed #DDE1E6',
            }}>
            <Typography fontSize="13px" fontWeight={600} color="#1758BA">
              {content.question}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            onClick={onSecondary}
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
            {content.secondary.label}
          </Button>

          <Button
            type="button"
            fullWidth
            variant="contained"
            disableElevation
            onClick={onPrimary}
            sx={{
              height: '50px',
              fontWeight: 700,
              fontSize: '15px',
              borderRadius: '10px',
              bgcolor: '#1758BA',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1758BA', opacity: 0.92, boxShadow: 'none' },
            }}>
            {content.primary.label}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
});

export default StartFromContinueDialogUpdated;
