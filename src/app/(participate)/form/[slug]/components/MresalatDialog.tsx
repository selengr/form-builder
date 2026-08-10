'use client';

import Image from 'next/image';
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
        {/* Close */}
        <IconButton
          onClick={onClose}
          aria-label="بستن"
          sx={{
            position: 'absolute',
            top: { xs: 12, sm: 20 },
            left: { xs: 12, sm: 20 },
            zIndex: 10,

            width: { xs: 38, sm: 44 },
            height: { xs: 38, sm: 44 },

            color: '#292929',

            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)',
            },
          }}
        >
          <CgClose size={30} />
        </IconButton>

        {/* Banner */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1 / 1',
          }}
        >
          <Image
            src="/images/home-page/mresalat-banner.svg"
            alt="وام قرض الحسنه بدون کارمزد امرسالت"
            fill
            priority
            sizes="(max-width: 600px) 100vw, 575px"
            style={{
              objectFit: 'cover',
            }}
          />
        </Box>

        {/* Footer */}
        <Box
          sx={{
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            px: { xs: 2, sm: 4 },
            py: { xs: 2.5, sm: 3.5 },
          }}
        >
          <Box
            dir="ltr"
            sx={{
              width: '100%',
              maxWidth: '355px',
              height: { xs: 58, sm: 70 },

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
                  xs: '12px',
                  sm: '15px',
                },

                fontWeight: 500,
                color: '#292929',

                whiteSpace: 'nowrap',
              }}
            >
              https://mresalat.ir
            </Typography>

            {/* Button */}
            <Box
              component="button"
              type="button"
              onClick={handleOpenMresalat}
              sx={{
                border: 0,
                outline: 0,
                flexShrink: 0,

                height: '100%',
                px: { xs: 2, sm: 3 },

                borderRadius: '999px',

                background:
                  'linear-gradient(135deg, #4CE0D1 0%, #20B9AF 100%)',

                color: '#fff',
                fontFamily: 'inherit',

                fontSize: {
                  xs: '13px',
                  sm: '16px',
                },

                fontWeight: 700,

                cursor: 'pointer',

                transition: 'all 0.2s ease',

                whiteSpace: 'nowrap',

                '&:hover': {
                  filter: 'brightness(0.96)',
                  transform: 'translateY(-1px)',
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