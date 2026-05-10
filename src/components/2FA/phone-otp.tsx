'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import AuthCode from 'react-auth-code-input';
import { BiAlarm } from 'react-icons/bi';
import { Box, Button, Typography, useTheme } from '@mui/material';
import TwoFAIcon from '@/../public/images/purchase-order/TwoFAIcon.svg';

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
  otpLength = 5,
  isLoading = false,
  onBack,
  onResend,
  onConfirm,
}: PhoneOtpPageProps) {
  const { palette } = useTheme();

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
    <Box width="100%" maxWidth="600px">
      <Box display="flex" alignItems="center" mb={2}>
        <Image src={TwoFAIcon} alt="احراز هویت" />
        <Typography mr={1} variant="body1" fontWeight="bold">
          تایید شماره موبایل
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="body2">
          کد تایید به شماره{' '}
          <Typography component="span" fontWeight="bold">
            {phone}
          </Typography>{' '}
          پیامک شد. لطفاً کد ارسال‌شده را وارد کنید.
        </Typography>

        <Box width="100%" display="flex" mt={1}>
          <AuthCode
            length={otpLength}
            allowedCharacters="numeric"
            onChange={(value) => {
              setOtpCode(value);
              if (otpError) setOtpError('');
            }}
            containerClassName="flex justify-space-between flex-row-reverse w-full"
            inputClassName="w-10 h-10 text-center bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 mx-auto"
          />
        </Box>

        {otpError && (
          <Typography
            component="span"
            variant="caption"
            color="error"
            sx={{
              minHeight: '14px',
              fontSize: '0.75rem',
              pr: '0.5rem',
            }}
          >
            {otpError}
          </Typography>
        )}

        <Box display="flex" justifyContent="center" alignItems="center" my={2}>
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
              sx={{ mx: 'auto' }}
            >
              ارسال مجدد
            </Button>
          )}
        </Box>

        <Box display="flex" gap={1}>
          <Button
            onClick={handleConfirmOtp}
            variant="contained"
            disabled={isLoading}
            sx={{
              borderRadius: '10px',
              boxShadow: 'none',
              flex: 2,
            }}
          >
            تایید
          </Button>

          <Button
            variant="outlined"
            onClick={onBack}
            disabled={isLoading}
            sx={{
              borderRadius: '10px',
              boxShadow: 'none',
              flex: 1,
            }}
          >
            بازگشت
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
