'use client';

import { CgClose } from 'react-icons/cg';
import {
  Box,
  Dialog,
  IconButton,
  Typography,
} from '@mui/material';

interface MresalatDialogProps {
  open: boolean;
  onClose: () => void;
}

const MRESALAT_URL = 'https://mresalat.ir';

export default function MresalatDialog({
  open,
  onClose,
}: MresalatDialogProps) {
  const handleOpenMresalat = () => {
    window.open(MRESALAT_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      dir="rtl"
      aria-labelledby="mresalat-dialog-title"
      sx={{
        '& .MuiDialog-container': {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(255, 255, 255, 0.55)',
          padding: '16px',
        },

        '& .MuiPaper-root': {
          width: '100%',
          maxWidth: '575px',
          margin: 0,
          borderRadius: '28px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          backgroundColor: '#fff',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={onClose}
          aria-label="بستن"
          sx={{
            position: 'absolute',
            top: {
              xs: 14,
              sm: 24,
            },
            left: {
              xs: 14,
              sm: 24,
            },
            zIndex: 10,

            width: {
              xs: 36,
              sm: 42,
            },
            height: {
              xs: 36,
              sm: 42,
            },

            color: '#242424',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',

            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            },
          }}
        >
          <CgClose size={28} />
        </IconButton>

        {/* Promotional image */}
        <Box
          component="img"
          src="/images/mresalat-banner.png"
          alt="وام قرض الحسنه بدون کارمزد امرسالت"
          sx={{
            display: 'block',
            width: '100%',
            height: 'auto',
            aspectRatio: '1 / 1',
            objectFit: 'cover',
          }}
        />

        {/* Bottom footer */}
        <Box
          sx={{
            width: '100%',
            backgroundColor: '#fff',

            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            px: {
              xs: 2,
              sm: 4,
            },

            py: {
              xs: 3,
              sm: 4,
            },
          }}
        >
          {/* URL + button */}
          <Box
            dir="ltr"
            sx={{
              width: '100%',
              maxWidth: '355px',
              height: {
                xs: 58,
                sm: 72,
              },

              border: '2px solid #202020',
              borderRadius: '999px',

              display: 'flex',
              alignItems: 'center',

              p: '4px',

              backgroundColor: '#fff',
            }}
          >
            {/* URL */}
            <Typography
              component="span"
              sx={{
                flex: 1,
                minWidth: 0,

                textAlign: 'center',

                fontSize: {
                  xs: '13px',
                  sm: '16px',
                },

                fontWeight: 500,
                color: '#292929',

                whiteSpace: 'nowrap',
              }}
            >
              https://mresalat.ir
            </Typography>

            {/* Enter button */}
            <Box
              component="button"
              type="button"
              onClick={handleOpenMresalat}
              sx={{
                border: 0,
                outline: 0,

                flexShrink: 0,

                height: '100%',

                px: {
                  xs: 2,
                  sm: 3,
                },

                borderRadius: '999px',

                background:
                  'linear-gradient(135deg, #49e1d2 0%, #22bcb2 100%)',

                color: '#fff',

                fontFamily: 'inherit',

                fontSize: {
                  xs: '14px',
                  sm: '16px',
                },

                fontWeight: 700,

                cursor: 'pointer',

                boxShadow:
                  'inset 0 1px 1px rgba(255,255,255,0.35), 0 2px 5px rgba(0,0,0,0.08)',

                transition: 'all 0.2s ease',

                whiteSpace: 'nowrap',

                '&:hover': {
                  transform: 'translateY(-1px)',
                  filter: 'brightness(0.97)',
                  boxShadow:
                    'inset 0 1px 1px rgba(255,255,255,0.35), 0 4px 10px rgba(0,0,0,0.12)',
                },

                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              ورود به امرسالت
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}