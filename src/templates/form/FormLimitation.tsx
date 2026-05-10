'use client';

import { Box, Button, TextField, Typography } from '@mui/material';
import AnimatedBox from './AnimatedBox';
import ActionButtons from './ActionButtons';
import { ILimitation } from '@/hooks/useParticipateForm';
import { Dispatch, SetStateAction, useState } from 'react';
import { useFormLimitation } from '@/hooks/useFormLimitation';
import AuthCode from 'react-auth-code-input'; 
import PhoneOtpPage from '@/components/2FA/phone-otp';
interface Props {
  type: '' | 'PHONE_NUMBER' | 'EMAIL';
  setLimitation: Dispatch<SetStateAction<ILimitation>>;
  setQuestion: Dispatch<any>;
  addQuestion: (data: any) => void;
}

export default function FormLimitation({ type, setLimitation, setQuestion, addQuestion }: Props) {
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
    confirmOtp
   } = useFormLimitation(type, setLimitation, setQuestion, addQuestion);

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

  /* ------------ OTP PAGE ------------ */

  // if (isPhone && step === 'otp') {
    return (
      <AnimatedBox key="otp-page">
        <PhoneOtpPage
          phone={formValue}
          otpLength={5}
          isLoading={loading}
          onBack={() => setStep('form')}
          onResend={resendOtp}
          onConfirm={confirmOtp}
        />
      </AnimatedBox>
    );
  // }

  /* ------------ FORM PAGE ------------ */

  return (
    <>
      <AnimatedBox key='form-limitation'>
        <Box display='flex' flexDirection='column' gap={1} width='100%' maxWidth='600px'>
          <Box display='flex' justifyContent='space-between' width='100%'>
            <Typography sx={{ marginRight: '25px', fontWeight: 600 }}>{label}</Typography>
          </Box>

          <TextField
            placeholder={placeholder}
            type={isPhone ? 'tel' : 'text'}
            value={formValue}
            onChange={(e) => handleChange(e.target.value)}
            error={error}
            helperText={helperText}
            fullWidth
            sx={{
              '& .MuiInputBase-root': { padding: 1.5 },
              '& input': { padding: 0 },
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

          <Typography variant='subtitle2' sx={{ fontSize: 12, fontWeight: 500 }}>
            لطفاً {label} خود را برای ادامه وارد کنید
          </Typography>
        </Box>
      </AnimatedBox>

      <ActionButtons
        disablePrev
        nextAction={handleNext}
        loadingNext={loading}
      />
    </>
  );
}
