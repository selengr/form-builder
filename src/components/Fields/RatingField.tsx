'use client';

import { memo, useMemo, useState } from 'react';
import { ElementsType, FormElement, FormElementInstance } from '../../types/FormElements';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Stack, Typography } from '@mui/material';
import FormProvider from '../../components/hook-form/FormProvider';
import { RHFMultiSelect, RHFSwitch, RHFTextField } from '@/components/hook-form';
import FieldDialogActionBottomButtons from '../FieldDialogActionBottomButtons/FieldDialogActionBottomButtons';
import { IFormElementConstructor, IQPLRating, IRatingQTapAndOptionsType } from '@/types/bulider';
import { AxiosApi } from '@/services/axios/AxiosApi';
import useElements from '@/hooks/useElements';
import useDesigner from '@/hooks/useDesigner';
import useActionOpenDialog from '@/hooks/useActionOpenDialog';
import useActionSelectedElement from '@/hooks/useActionSelectedElement';
import useSelectedElement from '@/hooks/useSelectedElement';
import useActionDesigner from '@/hooks/useActionDesigner';
import CheckIcon from '@/../public/images/home-page/spectral.svg';
import { SwitchButton } from '../Switch/SwitchButton';
import StarRating from '../Rating/Start';
import EmojiRating from '../Rating/Emoji';
import { useSearchParams } from 'next/navigation';

const questionType: ElementsType = 'RATING';

const questionPropertyList: IQPLRating = [
  {
    questionPropertyEnum: 'RATING_TYPE',
    value: 'STAR',
    id: 1,
  },
  {
    questionPropertyEnum: 'REQUIRED',
    value: 'false',
    id: 2,
  },
  {
    questionPropertyEnum: 'DESCRIPTION',
    value: '',
    id: 3,
  },
  {
    questionPropertyEnum: 'STEP',
    value: 1,
    id: 5,
  },
  {
    questionPropertyEnum: "RATING_START_LABEL",
    value: "",
    id: 6,
  },
  {
    questionPropertyEnum: "RATING_END_LABEL",
    value: "",
    id: 7,
  },
  {
    id: 8,
    questionPropertyEnum: 'EDIT_ANSWER_LOCKED',
    value: 'false',
  },
];


const ratingTypeOptions: IRatingQTapAndOptionsType = [
  { value: 'STAR', label: 'ستاره‌ایی' },
  { value: 'HEART', label: 'قلب' },
  { value: 'EMOJI', label: 'ایموجی' },
];


const propertiesSchema = z
  .object({
    title: z
      .string()
      .trim()
      .transform((value) => value.replace(/\s+/g, ' '))
      .pipe(z.string().min(1, { message: 'حداقل باید 1 و حداکثر 4000 کاراکتر باشد' }).max(3999, { message: 'حداقل باید 1 و حداکثر 4000 کاراکتر باشد' })),
    label: z
      .string()
      .trim()
      .transform((value) => {
        const normalized = value.replace(/\s+/g, ' ');
        return normalized === '' ? null : normalized;
      })
      .nullable()
      .refine(
        (value) =>
          value === null ||
          !/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(value),
        {
          message: 'استفاده از حروف فارسی مجاز نیست',
        }
      )
      .refine(
        (value) => value === null || (value.length >= 8 && value.length <= 30),
        {
          message: 'حداقل باید 8 و حداکثر 30 کاراکتر باشد',
        }
      ),
    RATING_TYPE: z.object({ value: z.string(), id: z.number() }),
    STEP: z.object({
      value: z.union([z.number(), z.string()]),
      id: z.number(),
    }),
    DESCRIPTION: z.object({
      value: z
        .string()
        .trim()
        .transform((value) => value.replace(/\s+/g, ' '))
        .pipe(z.string().max(3999, { message: 'حداکثر میتواند 4000 کاراکتر باشد' }))
        .optional(),
      id: z.number(),
    }),
    RATING_START_LABEL: z.object({
      value: z.union([z.number(), z.string()]).optional().nullable()
        .pipe(z.string().max(30, { message: 'حداکثر میتواند 30 کاراکتر باشد' })),
      id: z.number(),
    }),
    RATING_END_LABEL: z.object({
      value: z.union([z.number(), z.string()]).optional().nullable()
        .pipe(z.string().max(30, { message: 'حداکثر میتواند 30 کاراکتر باشد' })),
      id: z.number(),
    }),
    REQUIRED: z.object({
      value: z.boolean().default(false),
      id: z.number(),
    }),
    EDIT_ANSWER_LOCKED: z.object({
      value: z.boolean().default(false),
      id: z.number(),
    }),
    // optionList: z.array(optionsSchema).max(10, { message: 'حداکثر میتواند 10 برچسب وجود داشته باشد' }),
  })


const DesignerComponent = memo(function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const labelText = element.title;
  const designerBtnLabel = RatingFormElement.designerBtnElement.label;

  return (
    <div
      className='flex items-start flex-col overflow-hidden absolute'
      dir='rtl'
      style={{
        width: 'calc(100% - 96px)',
      }}>
      <p dir='rtl' className='text-base overflow-hidden text-ellipsis w-full' style={{ textWrap: 'nowrap', fontWeight: '700' }}>
        {labelText}
      </p>
      <p className='text-xs text-[#424242]'>#{designerBtnLabel}</p>
    </div>
  );
});

export const RatingFormElement: FormElement = {
  questionType,
  construct: ({ questionId, questionGroupId, formId, title, position }: IFormElementConstructor) => ({
    questionId,
    questionGroupId,
    formId,
    title,
    questionType,
    position,
    questionPropertyList: questionPropertyList,
    // optionList: optionList,
  }),
  designerBtnElement: {
    label: 'امتیازدهی',
    icon: CheckIcon,
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: (formElement: FormElementInstance, currentValue: string): boolean => {
    const element = formElement as CustomInstance;
    if (element.questionPropertyList.required) {
      return currentValue.length > 0;
    }

    return true;
  },
};

type CustomInstance = FormElementInstance & {
  questionPropertyList: typeof questionPropertyList;
};

function FormComponent({ elementInstance, value, onChange, error }: { elementInstance?: FormElementInstance; value?: string; onChange?: (value: string) => void; error?: string }) {
  const element = elementInstance as CustomInstance;
  const start = element.questionPropertyList.find((el) => el.questionPropertyEnum === 'RATING_START_LABEL')?.value
  const end = element.questionPropertyList.find((el) => el.questionPropertyEnum === 'RATING_END_LABEL')?.value

  const [startValue, setStarValue] = useState<number | undefined>(value as any);
  const ratingType = element.questionPropertyList.find((el) => el.questionPropertyEnum === 'RATING_TYPE')?.value;

  const description = element.questionPropertyList.find((el) => el.questionPropertyEnum === 'DESCRIPTION')?.value;



  console.log('startValue ===', startValue)
  const handleChange = (value: number) => {
    setStarValue(value as any);
    onChange?.(value as any);
  };

  return (
    <Box width='100%' maxWidth='1000px'>
      <Typography
        sx={{
          marginBottom: description ? '0.5rem' : '3rem',
          fontSize: '1rem',
          fontWeight: '600',
        }}>
        {element.title}
      </Typography>
      {description && (
        <Typography sx={{ fontSize: '12px', fontWeight: '500', marginBottom: '3rem' }} variant='subtitle2'>
          {description}
        </Typography>
      )}
      {ratingType === 'STAR' ? (
        <>

          <StarRating
            value={startValue}
            onChange={handleChange}
            precision={0.2}
            startValue={start}
            endValue={end}
          />

          {!!error && <Typography color='#f44336'>{error}</Typography>}
        </>
      ) : ratingType === 'HEART' ? (
        <>
          <StarRating
            value={startValue}
            onChange={handleChange}
            precision={0.2}
            heart={true}
            startValue={start}
            endValue={end}
          />
          {!!error && <Typography color='#f44336'>{error}</Typography>}
        </>
      ) : (
        <EmojiRating
          value={startValue}
          onChange={handleChange}
          clickableEmojis
          startValue={start}
          endValue={end}
        />

      )


      }
    </Box>
  );
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const elements = useElements();
  const setOpenDialog = useActionOpenDialog();
  const setSelectedElement = useActionSelectedElement();
  const selectedElement = useSelectedElement();
  const { updateElement, addElement } = useActionDesigner();
  const { questionGroups } = useDesigner();

  const [openDescriptionSwitch, setOpenDescriptionSwitch] = useState<boolean>(() =>
    element.questionPropertyList.some((property) => {
      return property.questionPropertyEnum === 'DESCRIPTION' && property.value;
    }),
  );

  const searchParams = useSearchParams();
  const search = searchParams.get('survey');
  const isSurvey = search === 'admin';

  const defaultValues = useMemo(() => {
    const values = element.questionPropertyList.reduce((acc: any, attribute: any) => {
      if (!acc[attribute.questionPropertyEnum]) {
        acc[attribute.questionPropertyEnum] = {};
      }

      if (attribute.questionPropertyEnum === 'REQUIRED' || attribute.questionPropertyEnum === 'EDIT_ANSWER_LOCKED') {
        acc[attribute.questionPropertyEnum].value = attribute.value === 'true';
      } else if (attribute.questionPropertyEnum === 'RATING_START_LABEL' || attribute.questionPropertyEnum === 'RATING_END_LABEL' || attribute.questionPropertyEnum === 'STEP') {
        acc[attribute.questionPropertyEnum].value = attribute.value === '' ? "" : attribute.value;
      } else if (attribute.questionPropertyEnum === 'DESCRIPTION') {
        acc[attribute.questionPropertyEnum].value = attribute.value === null ? '' : attribute.value;
      } else {
        acc[attribute.questionPropertyEnum].value = attribute.value;
      }

      acc[attribute.questionPropertyEnum].id = attribute.id;

      return acc;
    }, {});
    values.title = element.title;
    values.label = element.label ?? null;
    return values;
  }, []);

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onSubmit',
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  async function onSubmit(values: propertiesFormSchemaType) {
    const { title, label, DESCRIPTION, REQUIRED, RATING_TYPE, STEP, RATING_START_LABEL, RATING_END_LABEL, EDIT_ANSWER_LOCKED } = values;

    const selectedYet = elements?.find((el: any) => el?.questionId === element?.questionId);

    const propertiesData = [
      {
        questionPropertyEnum: 'RATING_TYPE',
        value: RATING_TYPE.value,
        id: selectedYet ? RATING_TYPE.id : null,
      },
      {
        questionPropertyEnum: 'REQUIRED',
        value: REQUIRED.value ? 'true' : 'false',
        id: selectedYet ? REQUIRED.id : null,
      },
      {
        questionPropertyEnum: 'DESCRIPTION',
        value: openDescriptionSwitch && DESCRIPTION.value ? DESCRIPTION.value : null,
        id: selectedYet ? DESCRIPTION.id : null,
      },
      {
        questionPropertyEnum: 'EDIT_ANSWER_LOCKED',
        value: EDIT_ANSWER_LOCKED.value ? 'true' : 'false',
        id: selectedYet ? EDIT_ANSWER_LOCKED.id : null,
      },
      {
        questionPropertyEnum: 'STEP',
        value: RATING_TYPE.value === "EMOJI" ? STEP.value : 0.5,
        id: selectedYet ? STEP.id : null,
      },
      {
        questionPropertyEnum: 'RATING_START_LABEL',
        value: RATING_START_LABEL.value,
        id: selectedYet ? RATING_START_LABEL.id : null,
      },
      {
        questionPropertyEnum: 'RATING_END_LABEL',
        value: RATING_END_LABEL.value,
        id: selectedYet ? RATING_END_LABEL.id : null,
      },
    ];

    const lastIndexOfGroup = elements.findLastIndex((el: any) => el.questionGroupId === selectedElement?.fieldElement?.questionGroupId);

    const group = elements.filter((el: any) => el.questionGroupId === selectedElement?.fieldElement?.questionGroupId);

    let findSelectedGroupPreviousGroup = questionGroups.findIndex((el: any) => el === selectedElement?.fieldElement?.questionGroupId) - 1;

    if (findSelectedGroupPreviousGroup === -1) {
      findSelectedGroupPreviousGroup = 0;
    }

    const firstIndexAfterThePreviousSelectedGroup = elements.findLastIndex((el: any) => el.questionGroupId === questionGroups[findSelectedGroupPreviousGroup]) + 1;

    delete element.temp;


    const finalFieldData = {
      ...element,
      title,
      position: selectedElement?.position?.apiPosition ?? group.length,
      questionPropertyList: propertiesData,
      label: label ?? null,
    };

    if (!selectedYet) {
      const removeId: any = { ...finalFieldData };
      delete removeId.questionId;

      try {
        const { data }: any = await AxiosApi.post('/question', removeId as any);
        delete data.questionPropertyList;
        const newData = {
          ...data,
        };

        const positionToUse = lastIndexOfGroup === -1 ? firstIndexAfterThePreviousSelectedGroup : lastIndexOfGroup + 1;
        addElement(selectedElement?.position?.realPosition ?? positionToUse, newData);

        setOpenDialog(false);
        setSelectedElement(null);
        reset();
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const { data }: any = await AxiosApi.put(`/question/${finalFieldData.questionId}`, finalFieldData);
        delete data.questionPropertyList;
        const newData = {
          ...data,
        };
        updateElement(element.questionId, newData);
        setOpenDialog(false);
        setSelectedElement(null);
        reset();
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          paddingX: 1.5,
          direction: 'ltr',
          width: '100%',
        }}>
        <Stack spacing={1}>
          <Typography variant='subtitle2' fontWeight='700'>
            متن سوال:
          </Typography>
          <RHFTextField multiline rows={3} name='title' />
        </Stack>
        {isSurvey &&
          <Stack spacing={1} mt={1}>
            <Typography variant='subtitle2' fontWeight='700'>
              شناسه:
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                direction: 'ltr',
                width: '100%',
                paddingX: 0.5,
                '& .MuiFormControl-root, & .MuiInputBase-root': {
                  borderRadius: '10px',
                },
              }}>
              <RHFTextField name='label' dir='ltr'/>
            </Box>
          </Stack>
        }

        <Stack spacing={1} marginTop={2.5}>
          <Typography variant='subtitle2' fontWeight='700'>
            نوع پاسخ:
          </Typography>
          <RHFMultiSelect name='RATING_TYPE.value' options={ratingTypeOptions} />
        </Stack>


        <Stack>
          <Box display='flex' justifyContent='space-between' alignItems='center' marginTop={3} marginBottom={0.5}>
            <Typography sx={{ width: '90%' }} fontWeight='700'>
              برچسب:
            </Typography>
            <Typography sx={{ width: '10%' }} fontWeight='700'>
              مکان:
            </Typography>
          </Box>
          <div className='flex'>

            <RHFTextField name='RATING_START_LABEL.value' placeholder='برچسب' />
            <div className='flex w-11 h-10 mr-2 justify-center items-center rounded-lg border-2 border-[#DDE1E6]'>
              <span className='text-[#A8A8A8] text-xs'>ابتدا</span>
            </div>
          </div>
          <div className='flex mt-2'>

            <RHFTextField name='RATING_END_LABEL.value' placeholder='برچسب' />
            <div className='flex w-11 h-10 mr-2 justify-center items-center rounded-lg border-2 border-[#DDE1E6]'>
              <span className='text-[#A8A8A8] text-xs'>انتها</span>
            </div>
          </div>

        </Stack>

        <Stack flexDirection='row' justifyContent='space-between' alignItems='flex-start' marginTop={3}>
          <Typography variant='subtitle2' fontWeight='700'>
            پاسخ به سوال اجباری باشد
          </Typography>
          <RHFSwitch label='' name='REQUIRED.value' labelPlacement='start' sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }} />
        </Stack>

        <Stack flexDirection='row' justifyContent='space-between' alignItems='flex-start' marginTop={1.5}>
          <Typography variant='subtitle2' fontWeight='700'>
            پاسخ غیر قابل ویرایش
          </Typography>
          <RHFSwitch label='' name='EDIT_ANSWER_LOCKED.value' labelPlacement='start' sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }} />
        </Stack>

        <Stack spacing={1} marginTop={0.5} flexDirection='row' justifyContent='space-between' alignItems='flex-end'>
          <Typography variant='subtitle2' fontWeight='700'>
            توضیحات
          </Typography>
          <SwitchButton onChange={() => setOpenDescriptionSwitch((prev) => !prev)} checked={openDescriptionSwitch} />
        </Stack>

        {openDescriptionSwitch && (
          <Stack marginTop={2}>
            <Typography variant='subtitle2' fontWeight='700' marginBottom={1.5}>
              متن توضیح:
            </Typography>
            <RHFTextField name='DESCRIPTION.value' placeholder='پیامی برای توضیح بیشتر در مورد این سوال' />
          </Stack>
        )}

        <FieldDialogActionBottomButtons status={isSubmitting} />
      </Box>
    </FormProvider>
  );
}
