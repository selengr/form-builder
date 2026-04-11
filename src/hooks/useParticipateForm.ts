'use client';

import { toast } from 'sonner';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
// components
import withValidation from '@/components/Fields/FormHOC';
// actions
import {
  takePartAction,
  insertAnswerAction,
  checkAnswerBeforeAction,
  getPreviousQuestionAction,
  checkResponseLimitationAction,
} from "../../actions/take-part"
// types
import { ElementsType, FormElements } from '@/types/FormElements';
// actions
// import { fetchUserInfo } from '@/lib/auth';
import { fetchUserInfoServer } from '../../actions/auth';

export interface ILimitation {
  isLimited: boolean;
  limitationType: '' | 'PHONE_NUMBER' | 'EMAIL';
}

interface HasError {
  status: boolean;
  message: string;
}

export const useParticipateForm = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const refId = searchParams.get('refId');
  const isSurvey = pathname.includes('survey-');
  const [formName, setFormName] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [realFormID, setRealFormID] = useState();
  const [formData, setFormData] = useState<any>('');
  const [answerId, setAnswerId] = useState<number>();
  const [finishPage, setFinishPage] = useState(false);
  const [question, setQuestion] = useState<any>(null);
  const [firstLoading, setFirstLoading] = useState(true);
  const [takePartId, setTakePartId] = useState<any>(null);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [firstQuestionId, setFirstQuestionId] = useState<number | string | null>(null);
  const [showReportForResponder, setShowReportForResponder] = useState<boolean>(false);
  const [hasError, setHasError] = useState<HasError>({ status: false, message: '' });
  const [limitation, setLimitation] = useState<ILimitation>({
    isLimited: false,
    limitationType: '',
  });

  const hasFetchedRef = useRef(false);
  const { slug } = useParams<{ slug: string }>();

  const isCurrentFirstQuestion = useMemo(() => {
    return question?.questionId === firstQuestionId;
  }, [question, firstQuestionId]);

  const extractProperty = useCallback(
    (list: any[], key: string) => list?.find(item => item.questionPropertyEnum === key)?.value,
    []
  );

  const initializeQuestion = useCallback(
    (q: any, previousAnswers?: any[]) => {
      if (!q?.questionType) return setQuestion(null);

      const props = q.questionPropertyList;
      const required = extractProperty(props, 'REQUIRED') === 'true';
      const pattern = extractProperty(props, 'TEXT_FIELD_PATTERN');
      const minLength = Number(extractProperty(props, 'MINIMUM_LEN'));
      const isMultiSelect = extractProperty(props, 'MULTI_SELECT') === 'true';
      const spectralType = extractProperty(props, 'SPECTRAL_TYPE');

      let value: any = '';
      let currentAnswerId: any

      if (previousAnswers && previousAnswers.length > 0) {
        const first = previousAnswers[0];

        if (q.questionType === 'SPECTRAL'
        ) {
          if (spectralType === 'DOMAIN') {
            if (previousAnswers[0].answer == null) {
              value = [null, 100]
            } else {
              value = previousAnswers.map(a => {
                if (a.answer === null) {
                  return null
                } else {
                  return Number(a.answer)
                }
              });
            }

            currentAnswerId = previousAnswers.reduce((acc, a, index) => {
              acc[index] = a.id;
              console.log('acc', acc)
              return acc;
            }, {} as Record<number, number>);
          } else {
            if (first.answer === null) {
              value = null
            } else {
              value = Number(first.answer);
            }
            currentAnswerId = first?.id;
          }
        } else if (['MULTIPLE_CHOICE', 'MULTIPLE_CHOICE_IMAGE'].includes(q.questionType)) {
          if (isMultiSelect) {
            value = previousAnswers.map(a => a.optionId);
            currentAnswerId = previousAnswers.reduce((acc, a) => {
              acc[a.optionId] = a.id;
              return acc;
            }, {} as Record<number, number>);
          } else {
            value = first.optionId;
            currentAnswerId = first?.id;
          }
        } else {
          value = first.answer;
          currentAnswerId = first?.id;
        }
      } else {
        if (q.questionType === 'SPECTRAL') {
          // const start = Number(extractProperty(props, 'SPECTRAL_START')) || 0;
          const end = Number(extractProperty(props, 'SPECTRAL_END')) || 10;
          // empty condition
          value = spectralType === 'DOMAIN' ? [null, end] : null;
        } else if (['MULTIPLE_CHOICE', 'MULTIPLE_CHOICE_IMAGE'].includes(q.questionType)) {
          value = isMultiSelect ? [] : '';
        } else {
          value = '';
        }
      }

      let valid = false;

      if (!required) {
        valid = true;
      } else if (q.questionType === 'TEXT_FIELD') {
        valid = !!value && String(value).length >= (minLength || 0);
      } else if (['MULTIPLE_CHOICE', 'MULTIPLE_CHOICE_IMAGE'].includes(q.questionType)) {
        if (isMultiSelect) {
          valid = Array.isArray(value) && value.length > 0;
        } else {
          valid = !!value;
        }
      } else if (q.questionType === 'SPECTRAL') {
        // valid = value !== null && value !== undefined;
        if (Array.isArray(value)) {
          valid = value[0] !== null;
        } else {
          valid = value !== null
        }

      } else {
        valid = !!value;
      }

      setIsValid(valid);
      setFormData(value);
      setQuestion(q);
      setAnswerId(currentAnswerId);
    },
    [extractProperty]
  );

  const fetchInitialData = useCallback(async () => {
    try {
      //  const isLink = /^(public-|solo-|group-|survey-)/.test(slug);

      // const res = await AxiosApi.post('/take-part/check-response-limitation-form', {
      //   link: isLink ? slug : null,
      //   id: !isLink ? slug : null,
      // });
      const result = await checkResponseLimitationAction({ slug })

      const { userInfo } = await fetchUserInfoServer();
      const username = userInfo?.user?.username || null;

      if (result?.data?.loggedInStatus === false && result?.data?.responseLimitation) {
        setLimitation({
          isLimited: true,
          limitationType: result?.data?.responseLimitation,
        });
      } else if (result?.data?.responseLimitation) {
        await checkAnswerBefore(username);
      } else {
        await takePart(username);
      }
    } catch (error:any) {
       toast.error( error?.message || 'انجام عملیات با خطا مواجه شد');
       setHasError({ status: true, message: error?.message || 'انجام عملیات با خطا مواجه شد' })
    } finally {
      setFirstLoading(false);
    }
  }, [slug]);

  const takePart = async (username: string | null) => {
    setFirstLoading(true)
    setQuestionLoading(true)
    try {
      // const res = await AxiosApi.post('/take-part', {
      //   link: isLink ? slug : null,
      //   formId: !isLink ? slug : null,
      //   username,
      //   from : from ?? "PUBLIC_PAGE"
      // });
      const res = await takePartAction({
        slug,
        username,
        from: from ?? undefined,
        refId: refId ?? undefined,
      })

      const q = res.data?.questionModel;

      if (q?.isFirstQuestion) {
        setFirstQuestionId(q.questionId);
      }

      setRealFormID(res.data?.formId ?? '');
      setFormName(res.data?.formName);
      setTakePartId(res.data?.takePart);
      initializeQuestion(q);
    } catch (error:any) {debugger
       toast.error( error?.message || 'انجام عملیات با خطا مواجه شد');
        setHasError({ status: true, message: error?.message || 'انجام عملیات با خطا مواجه شد' })
    } finally {     
      setFirstLoading(false)
      setQuestionLoading(false)
    }
  };

  const checkAnswerBefore = async (username: string | null) => {
    try {
      // const res = await AxiosApi.post(url, {
      //   link: isLink ? slug : null,
      //   formId: !isLink ? slug : null,
      //   username,
      //   refId: refId ?? undefined,
      //   from: from ?? undefined,
      // });

        const params: any = {
          slug,
          username,
        };

        if (refId) params.refId = refId;
        if (from) params.from = from;

        const res = await checkAnswerBeforeAction(params);


      setTakePartId(res.data.takePart);
      setFormName(res.data?.formName);
      initializeQuestion(res.data.questionModel, res.data.userAnswerModel?.answersModel ?? []);
      } catch (error:any) {debugger
        toast.error( error?.message || 'انجام عملیات با خطا مواجه شد');
        setHasError({ status: true, message: error?.message || 'انجام عملیات با خطا مواجه شد' })
      }
  };

  const handleValidationUpdate = (valid: boolean, value: any) => {
    setIsValid(valid);
    setFormData(value);
  };

  const handleNext = async () => {
    if (!isValid) return toast.error('پاسخ به این سوال الزامی می‌باشد', {
      className: `max-w-[300px] ${isSurvey ? 'mb-12' : ''}`,
      duration: 2000,
      cancel: {
        label: 'بستن',
        onClick: () => console.log('Cancel!'),
      },
    })

    setQuestionLoading(true);

    try {
      const props = question.questionPropertyList;
      const isMultiSelect = extractProperty(props, 'MULTI_SELECT') === 'true';
      const spectralType = extractProperty(props, 'SPECTRAL_TYPE');
      const RATING_TYPE = extractProperty(props, 'RATING_TYPE');
      const isChoiceType = ['MULTIPLE_CHOICE', 'MULTIPLE_CHOICE_IMAGE'].includes(
        question.questionType
      );
      const INFO_FIELD = ['INFO_FIELD'].includes(question.questionType);

      let answerList;

      if (isChoiceType) {
        if (isMultiSelect) {
          const ids = Array.isArray(formData) ? formData : [];
          answerList = ids.map((item: any) => ({
            optionId: Number(item) || null,
            answer: String(item),
            id: typeof answerId === 'object' ? answerId[item] : undefined,
          }));
        } else {
          const optionId = Number(formData) || null;
          answerList = [
            {
              optionId,
              answer: String(formData),
              id: typeof answerId === 'number' ? answerId : undefined,
            },
          ];
        }
      } else if (question.questionType === 'SPECTRAL') {
        if (spectralType === 'DOMAIN') {
          if (Array.isArray(formData) && formData[0] === null) {
            toast.warning('پاسخی برای این سوال ثبت نشد', {
              className: `max-w-[300px] ${isSurvey ? 'mb-12' : ''}`,
              duration: 2000,
              cancel: {
                label: 'بستن',
                onClick: () => console.log('Cancel!'),
              },
            })
          }

          answerList = formData.map((val: number, index: number) => ({
            optionId: null,
            answer: formData[0] === null ? "" : String(val),
            id: typeof answerId === 'object' ? answerId[index] : undefined,
          }));
        } else {
          if (formData === null) {
            toast.warning('پاسخی برای این سوال ثبت نشد', {
              className: `max-w-[300px] ${isSurvey ? 'mb-12' : ''}`,
              duration: 2000,
              cancel: {
                label: 'بستن',
                onClick: () => console.log('Cancel!'),
              },
            })
          }
          answerList = [
            {
              optionId: null,
              answer: formData === null ? "" : String(formData),
              id: typeof answerId === 'number' ? answerId : undefined,
            },
          ];
        }
      } else if (INFO_FIELD) {
        answerList = [
          {
            optionId: null,
            id: typeof answerId === 'number' ? answerId : undefined,
            answer: "#",
          },
        ];
      } else if (question.questionType === 'RATING') {
        if (formData === "") {
          toast.warning('پاسخی برای این سوال ثبت نشد', {
            className: `max-w-[300px] ${isSurvey ? 'mb-12' : ''}`,
            duration: 2000,
            cancel: {
              label: 'بستن',
              onClick: () => console.log('Cancel!'),
            },
          })
        }

        answerList = [
          {
            optionId: null,
            id: typeof answerId === 'number' ? answerId : undefined,
            answer: formData ? String(formData) : null,
          },
        ];
      } else {
        answerList = [
          {
            optionId: null,
            id: typeof answerId === 'number' ? answerId : undefined,
            answer: String(formData),
          },
        ];
      }

      // const res = await AxiosApi.post('/take-part/insert-answer', {
      //   formId: question.formId,
      //   takePartId,
      //   questionId: question.questionId,
      //   answerList,
      // });
      const res = await insertAnswerAction({
        formId: question.formId,
        takePartId,
        questionId: question.questionId,
        answerList,
      })

      if (res.questionId) {
        initializeQuestion(res, res.oldAnswers ?? []);
      } else {
        setFinishPage(true);
        setShowReportForResponder(res?.showReportForResponder);
      }
    } catch (error: any) {
      toast.error(error?.message || 'انجام عملیات با خطا مواجه شد', {
        className: `max-w-[300px] ${isSurvey ? 'mb-12' : ''}`,
        duration: 2000,
        cancel: {
          label: 'بستن',
          onClick: () => console.log('Cancel!'),
        },
      });
    } finally {
      setQuestionLoading(false);
    }
  };

  const handlePrev = async () => {
    try {
      setQuestionLoading(true);
      const res = await getPreviousQuestionAction({ takePartId })
      // const res = await AxiosApi.post('/question/previous-question', { takePartId });
      const q = res.data.questionModel;
      const a = res.data.oldAnswers?.answersModel ?? [];
      initializeQuestion(q, a);
      setIsValid(true);
      } catch (error: any) {
        toast.error(error?.message || 'خطا در بازگشت به سوال قبلی', {
          className: `max-w-[300px] ${isSurvey ? 'mb-12' : ''}`,
          duration: 2000,
        })
    } finally {
      setQuestionLoading(false);
    }
  };

  const FormComponent = useMemo(() => {
    return question?.questionType
      ? FormElements[question.questionType as ElementsType]?.formComponent
      : null;
  }, [question]);

  const ValidatedInput = useMemo(() => {
    return FormComponent ? withValidation(FormComponent) : () => null;
  }, [FormComponent]);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    firstLoading,
    questionLoading,
    finishPage,
    limitation,
    question,
    formData,
    formName,
    ValidatedInput,
    handleValidationUpdate,
    handleNext,
    handlePrev,
    replace,
    takePartId,
    setTakePartId,
    setLimitation,
    setQuestion,
    initializeQuestion,
    hasError,
    realFormID,
    isCurrentFirstQuestion,
    showReportForResponder
  };
};