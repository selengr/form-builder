'use client';

import AnimatedBox from './AnimatedBox';
import { Box, TextField, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
// components
import ActionButtons from './ActionButtons';
import PhoneOtpPage from '@/components/2FA/phone-otp';
// hooks
import { ILimitation, IStartFromContinu } from '@/hooks/useParticipateForm';
import { useFormLimitation } from '@/hooks/useFormLimitation';
import { ErrorStep } from '@/app/(participate)/form/[slug]/components';
import { useRouter } from 'next/navigation';
interface Props {
  type: '' | 'PHONE_NUMBER' | 'EMAIL';
  setLimitation: Dispatch<SetStateAction<ILimitation>>;
  setQuestion: Dispatch<any>;
  addQuestion: (data: any) => void;
  setStartFromContinue: Dispatch<SetStateAction<IStartFromContinu>>;
}

export default function FormLimitation({ type, setLimitation, setQuestion, addQuestion, setStartFromContinue }: Props) {
  const { replace } = useRouter();
  const {
    formValue,
    error,
    helperText,
    loading,
    handleChange,
    handleSubmit,
    takePartApi,
    isValid,
    sendOtp,
    resendOtp,
    hasError,
    confirmOtp
  } = useFormLimitation(type, setLimitation, setQuestion, addQuestion, setStartFromContinue);

  const [step, setStep] = useState<'form' | 'otp'>('form');

  const isPhone = type === 'PHONE_NUMBER';
  const label = isPhone ? 'شماره موبایل' : 'ایمیل';
  const placeholder = isPhone ? '09129876543' : 'example@gmail.com';

  const handleNext = async () => {
    if (!isValid) {
      handleSubmit();
      return;
    }

    if (isPhone) {
      const success = await sendOtp();
      if (success) setStep('otp');
    } else {
      await takePartApi();
    }
  };

  if (hasError.status) {
    return <ErrorStep message={hasError.message} replace={replace} />
  }

  /* ------------ OTP PAGE ------------ */
  return (
    <Box
      width="100%"
      maxWidth="600px"
      mx="auto"
      display="flex"
      flexDirection="column"
      minHeight={320}
      maxHeight={450}
    >
      {isPhone && step === 'otp' ? (
        <AnimatedBox key="otp-page">
          <PhoneOtpPage
            phone={formValue}
            otpLength={6}
            isLoading={loading}
            onBack={() => setStep('form')}
            onResend={resendOtp}
            onConfirm={confirmOtp}
          />
        </AnimatedBox>
      ) : (
        <>
          <AnimatedBox key="form-limitation">
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
              width="100%"
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1rem',
                }}
              >
                {label}
              </Typography>

              <TextField
                placeholder={placeholder}
                type={isPhone ? 'tel' : 'text'}
                value={formValue}
                onChange={(e) => handleChange(e.target.value)}
                error={error}
                helperText={helperText}
                fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    height: 56,
                    borderRadius: '16px',
                    backgroundColor: '#F5F7FA',
                    px: 1,
                  },

                  '& input': {
                    py: 0,
                    fontSize: '1rem',
                  },

                  '& .MuiFormHelperText-root': {
                    mr: 0.5,
                  },
                }}
                inputProps={{
                  ...(isPhone && {
                    maxLength: 11,
                    pattern: '[0-9]*',
                    onInput: (e: React.ChangeEvent<HTMLInputElement>) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    },
                  }),
                }}
              />

              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#666',
                }}
              >
                لطفاً {label} خود را برای ادامه وارد کنید
              </Typography>
            </Box>
          </AnimatedBox>
          <Box maxWidth="600px" mb={2}>
            <ActionButtons
              disablePrev
              nextAction={handleNext}
              loadingNext={loading}
            />
          </Box>

        </>
      )}
    </Box>
  );
}
