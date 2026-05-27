'use client';

import { Button } from '@mui/material';
import { useIframeDetector } from '@/hooks/useIframeDetector';

export default function ActionButtons({
  prevAction = () => { },
  nextAction = () => { },
  disablePrev = false,
  disableNext = false,
  loadingPrev = false,
  loadingNext = false,
}: {
  prevAction?: () => void;
  nextAction?: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
  loadingPrev?: boolean;
  loadingNext?: boolean;
}) {  
  const { isInIframe } = useIframeDetector();

  const buttonHeight = isInIframe ? 42 : 52;

  return (
    <div
      className={`w-full ${isInIframe ? 'mt-4' : 'mt-8'
        }`}
    >
      <div className="bg-[#F7F7FF] rounded-xl overflow-hidden flex items-center w-full">
        <Button
          variant="contained"
          loading={loadingPrev}
          onClick={prevAction}
          disabled={disablePrev}
          sx={{
            width: 120,
            minWidth: 120,
            height: { xs: 42, sm: buttonHeight },
            borderRadius: 0,
            bgcolor: '#1758BA',
            boxShadow: 'none',
            fontWeight: 600,
            fontSize: {
              xs: '0.75rem',
              sm: '0.875rem',
            },
            '&:hover': {
              bgcolor: '#174AA0',
              boxShadow: 'none',
            },
          }}
        >
          قبلی
        </Button>

        <div className="flex-1" />

        <Button
          variant="contained"
          loading={loadingNext}
          onClick={nextAction}
          disabled={disableNext}
          sx={{
            width: 120,
            minWidth: 120,
            height: { xs: 42, sm: buttonHeight },
            borderRadius: 0,
            bgcolor: '#1758BA',
            boxShadow: 'none',
            fontWeight: 600,
            fontSize: {
              xs: '0.75rem',
              sm: '0.875rem',
            },
            '&:hover': {
              bgcolor: '#174AA0',
              boxShadow: 'none',
            },
          }}
        >
          بعدی
        </Button>
      </div>
    </div>
  );
}
