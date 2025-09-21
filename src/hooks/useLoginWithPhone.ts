'use client';

import { useState } from 'react';

export function useLoginWithPhone(initialValue = '') {
  const [formValue, setFormValue] = useState(initialValue);
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');

  const validatePhone = (phone: string) => /^09\d{9}$/.test(phone);

  const handleChange = (value: string) => {
    setFormValue(value);
    if (!validatePhone(value)) {
      if (value.length === 0) {
        setError(true);
        setHelperText('شماره موبایل الزامی است');
      } else if (value.length < 11) {
        setError(true);
        setHelperText('شماره موبایل باید 11 رقم باشد');
      } else {
        setError(true);
        setHelperText("شماره موبایل باید با '09' شروع شود");
      }
    } else {
      setError(false);
      setHelperText('');
    }
  };

  const handleSubmit = () => {
    if (!validatePhone(formValue)) {
      setError(true);
      setHelperText('شماره تلفن همراه معتبر نمی‌باشد');
      return false;
    }
    return true;
  };

   const reset = () => {
    setFormValue('');
    setError(false);
    setHelperText('');
  };

  return {
    formValue,
    error,
    reset,
    helperText,
    setFormValue,
    handleChange,
    handleSubmit,
  };
}
