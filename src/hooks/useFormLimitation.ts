import { toast } from 'sonner';
import { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ILimitation } from '@/hooks/useParticipateForm';
// action
import { checkAnswerBeforeAction } from '../../actions/take-part';
import { AxiosApi } from '@/services/axios/AxiosApi';

export const useFormLimitation = (type: '' | 'PHONE_NUMBER' | 'EMAIL', setLimitation: (limitation: ILimitation) => void, setQuestion: (data: any) => void, addQuestion: (data: any) => void) => {
  const [formValue, setFormValue] = useState('');
  const [eventId, setEventId] = useState('');
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');
  const [loading, setLoading] = useState(false);


  const searchParams = useSearchParams();
  const refId = searchParams.get('refId');
  const from = searchParams.get('from');

  const { slug } = useParams<{ slug: string }>();

  const validatePhone = (phone: string) => /^09\d{9}$/.test(phone);
  const validateEmail = (email: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.toLowerCase());

  const handleChange = (value: string) => {
    setFormValue(value);
    if (type === 'PHONE_NUMBER') {
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
    } else {
      if (value.length === 0) {
        setError(true);
        setHelperText('ایمیل الزامی است');
      } else if (!validateEmail(value)) {
        setError(true);
        setHelperText('فرمت ایمیل صحیح نمی‌باشد');
      } else {
        setError(false);
        setHelperText('');
      }
    }
  };

  const handleSubmit = () => {
    setError(true);
    setHelperText(type === 'PHONE_NUMBER' ? 'شماره تلفن همراه الزامی می‌باشد' : 'ایمیل الزامی است');
  };

  const takePartApi = async (otpCode?:string) => {
    try {
      setLoading(true);
      const isLink = /^(public-|solo-|group-|survey-)/.test(slug);
      const response = await AxiosApi.post('/take-part/check-answer-to-form-before', {
        link: isLink ? slug : null,
        formId: !isLink ? slug : null,  
        username: formValue,
        refId: refId ?? undefined,

        eventId,
        code: Number(otpCode),
      });

      // const params: any = {
      //   slug,
      //   username: formValue,
      // };

      // if (refId) params.refId = refId;
      // if (from) params.from = from;

      // const response = await checkAnswerBeforeAction(params);

      addQuestion(response.data);
      setQuestion(response.data.questionModel);
      setLimitation({ isLimited: false, limitationType: '' });
    } catch (error: any) {
      toast.error(error?.response?.data?.message?.[0]?.title || 'انجام عملیات با خطا مواجه شد');
      setError(true);
      setHelperText(error?.response?.data?.message?.[0]?.title || 'انجام عملیات با خطا مواجه شد');
    } finally {
      setLoading(false);
    }
  };


  const sendOtp = async (): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await AxiosApi.post('/send-code', {
        phoneNumber: formValue,
      });
      setEventId(response.data.eventId)
      toast.success('کد تایید ارسال شد');
      return true;
    } catch (error: any) {
      const message =
        error?.response?.data?.message?.[0]?.title ||
        'ارسال کد با خطا مواجه شد';

      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (): Promise<boolean> => {
    return sendOtp();
  };

  const confirmOtp = async (
    otpCode: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);

      // await AxiosApi.post('/confirm-code', {
      //   eventId,
      //   code: otpCode,
      // });

      await takePartApi(otpCode);

      return { success: true };
    } catch (error: any) {
      const message =
        error?.response?.data?.message?.[0]?.title ||
        'کد وارد شده صحیح نیست';

      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const isValid = type === 'PHONE_NUMBER' ? validatePhone(formValue) : validateEmail(formValue);

  return {
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
    confirmOtp,
  };
};
