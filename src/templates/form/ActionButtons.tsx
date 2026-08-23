'use client';

import { Button, SxProps, Theme } from '@mui/material';
import { useIframeDetector } from '@/hooks/useIframeDetector';
import { memo } from 'react';

const BUTTON_SX: SxProps<Theme> = {
    width: 120,
    minWidth: 120,
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
    '&:disabled': {
        bgcolor: '#A0AEC0',
        color: '#FFFFFF',
    },
};

interface ActionButtonsProps {
    prevAction?: () => void;
    nextAction?: () => void;
    disablePrev?: boolean;
    disableNext?: boolean;
    loadingPrev?: boolean;
    loadingNext?: boolean;
    prevLabel?: string;
    nextLabel?: string;
}

function ActionButtons({
                           prevAction = () => {},
                           nextAction = () => {},
                           disablePrev = false,
                           disableNext = false,
                           loadingPrev = false,
                           loadingNext = false,
                           prevLabel = 'قبلی',
                           nextLabel = 'بعدی',
                       }: ActionButtonsProps) {
    const { isInIframe } = useIframeDetector();

    const buttonHeight = isInIframe ? 42 : 52;

    return (
        <div
            className={`w-full ${isInIframe ? 'mt-4' : 'mt-8'}`}
            role="group"
            aria-label="دکمه‌های ناوبری"
        >
            <div className="bg-[#F7F7FF] rounded-xl overflow-hidden flex items-center w-full">
                <Button
                    variant="contained"
                    loading={loadingPrev}
                    onClick={prevAction}
                    disabled={disablePrev || loadingPrev}
                    sx={{
                        ...BUTTON_SX,
                        height: { xs: 42, sm: buttonHeight },
                    }}
                    aria-label="مرحله قبلی"
                >
                    {prevLabel}
                </Button>

                <div className="flex-1" aria-hidden="true" />

                <Button
                    variant="contained"
                    loading={loadingNext}
                    onClick={nextAction}
                    disabled={disableNext || loadingNext}
                    sx={{
                        ...BUTTON_SX,
                        height: { xs: 42, sm: buttonHeight },
                    }}
                    aria-label="مرحله بعدی"
                >
                    {nextLabel}
                </Button>
            </div>
        </div>
    );
}

export default memo(ActionButtons);