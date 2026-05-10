'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import AuthCode from 'react-auth-code-input';
import { BiAlarm } from 'react-icons/bi';
import { Box, Button, Typography, useTheme } from '@mui/material';
import TwoFAIcon from '@/../public/images/purchase-order/TwoFAIcon.svg';
import { useIframeDetector } from '@/hooks/useIframeDetector';

interface PhoneOtpPageProps {
  phone: string;
  otpLength?: number;
  isLoading?: boolean;
  onBack: () => void;
  onResend: () => Promise<boolean>;
  onConfirm: (otpCode: string) => Promise<{ success: boolean; message?: string }>;
}

const OTP_EXPIRE_SECONDS = 120;

export default function PhoneOtpPage({
  phone,
  otpLength = 6,
  isLoading = false,
  onBack,
  onResend,
  onConfirm,
}: PhoneOtpPageProps) {
  const { palette } = useTheme();
  const { isInIframe } = useIframeDetector();
  const buttonHeight = isInIframe ? 42 : 52;

  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [remainingSeconds, setRemainingSeconds] = useState(OTP_EXPIRE_SECONDS);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (remainingSeconds <= 0) return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingSeconds]);

  const timeText = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }, [remainingSeconds]);

  const handleConfirmOtp = async () => {
    if (otpCode.length !== otpLength) {
      setOtpError('کد تایید را کامل وارد نمایید.');
      return;
    }
    setOtpError('');
    const result = await onConfirm(otpCode);
    if (!result.success) {
      setOtpError(result.message || 'کد وارد شده صحیح نیست');
    }
  };

  const handleResend = async () => {
    setResending(true);
    setOtpError('');
    const ok = await onResend();
    setResending(false);
    if (ok) {
      setOtpCode('');
      setRemainingSeconds(OTP_EXPIRE_SECONDS);
    }
  };

  return (
    <Box width="100%">
      <Box display="flex" alignItems="center" mb={2}>
        <Image src={TwoFAIcon} alt="احراز هویت" />
        <Typography ml={1} variant="body1" fontWeight="bold">
          تایید شماره موبایل
        </Typography>
      </Box>

      <Typography variant="body2" mb={4}>
        کد احراز به شماره همراه {phone} با سرشماره 50004848 پیامک شد. کد ارسال شده را وارد کنید.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={2}>
        <Box width="100%" maxWidth={380}>
          <AuthCode
            length={otpLength}
            allowedCharacters="numeric"
            // value={otpCode}
            onChange={(value) => {
              setOtpCode(value);
              if (otpError) setOtpError('');
            }}
            containerClassName="flex justify-between flex-row-reverse w-full gap-2"
            inputClassName="flex-1 h-[52px] max-w-[56px] text-center bg-gray-100 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 border border-transparent transition-all"
          />
        </Box>
      </Box>

      <Box minHeight="24px" mt={1}>
        {otpError && (
          <Typography variant="caption" color="error" sx={{ pr: 1 }}>
            {otpError}
          </Typography>
        )}
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center" mt={2} mb={4}>
        {remainingSeconds > 0 ? (
          <>
            <BiAlarm size="1.1rem" color={palette.grey[700]} />
            <Typography fontSize="0.8rem" mr={1} color={palette.grey[700]}>
              {timeText}
            </Typography>
          </>
        ) : (
          <Button
            onClick={handleResend}
            disabled={resending || isLoading}
            size="small"
            sx={{ fontWeight: 600 }}
          >
            ارسال مجدد
          </Button>
        )}
      </Box>

      <div
        className={`w-full justify-center items-center ${
          isInIframe ? 'm-1 my-0' : 'mt-8'
        }`}
      >
        <div className="bg-[#F7F7FF] rounded-xl overflow-hidden flex items-center">
          <Button
            variant="contained"
            onClick={onBack}
            disabled={isLoading}
            sx={{
              width: 120,
              height: buttonHeight,
              borderRadius: 0,
              bgcolor: '#1758BA',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#174AA0' },
            }}
          >
            بازگشت
          </Button>

          <div className="flex-1 flex items-center justify-center px-4"></div>

          <Button
            variant="contained"
            onClick={handleConfirmOtp}
            loading={isLoading}
            disabled={isLoading}
            sx={{
              width: 120,
              height: buttonHeight,
              borderRadius: 0,
              bgcolor: '#1758BA',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#174AA0' },
            }}
          >
            تایید
          </Button>
        </div>
      </div>
    </Box>
  );
}
