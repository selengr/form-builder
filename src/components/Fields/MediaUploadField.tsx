'use client';

import { z } from 'zod';
import { memo, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Stack, Typography } from '@mui/material';
// components
import { SwitchButton } from '../Switch/SwitchButton';
import FormProvider from '../../components/hook-form/FormProvider';
import { FIELD_PROPERTIES_FORM_ID } from '@/constants/fieldDialog';
import { RHFMultiSelect, RHFSwitch, RHFTextField } from '@/components/hook-form';
import FieldDialogActionBottomButtons from '../FieldDialogActionBottomButtons/FieldDialogActionBottomButtons';
// images
import VideoPlayIcon from '@/../public/images/home-page/video-play.svg';
// type
import { IFormElementConstructor, IQPLMediaUpload } from '@/types/bulider';
import type { ElementsType, FormElement, FormElementInstance } from '@/types/formElementTypes';

const questionType: ElementsType = 'IMAGE_UPLOAD';

const questionPropertyList: IQPLMediaUpload = [
  {
    questionPropertyEnum: 'REQUIRED',
    value: 'false',
    id: 1,
  },
  {
    questionPropertyEnum: 'DESCRIPTION',
    value: '',
    id: 2,
  },
  {
    questionPropertyEnum: 'EDIT_ANSWER_LOCKED',
    value: 'false',
    id: 3,
  },
];

const mediaTypeOptions = [
  { value: 'IMAGE_UPLOAD', label: 'تصویر' },
  { value: 'AUDIO_UPLOAD', label: 'صدا' },
];

const propertiesSchema = z.object({
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
    .refine((value) => value === null || !/[؀-ۿݐ-ݿࢠ-ࣿ]/.test(value), {
      message: 'استفاده از حروف فارسی مجاز نیست',
    })
    .refine((value) => value === null || (value.length >= 8 && value.length <= 30), {
      message: 'حداقل باید 8 و حداکثر 30 کاراکتر باشد',
    }),
  questionType: z.enum(['IMAGE_UPLOAD', 'AUDIO_UPLOAD']),
  DESCRIPTION: z.object({
    value: z
      .string()
      .trim()
      .transform((value) => value.replace(/\s+/g, ' '))
      .pipe(z.string().max(3999, { message: 'حداکثر میتواند 4000 کاراکتر باشد' }))
      .optional(),
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
});

type CustomInstance = FormElementInstance & {
  questionPropertyList: typeof questionPropertyList;
};

const DesignerComponent = memo(function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const designerBtnLabel = MediaUploadFormElement.designerBtnElement.label;

  return (
    <div className="flex items-start flex-col overflow-hidden min-w-0 w-full max-w-[90%]" dir="rtl">
      <p dir="rtl" className="text-[13px] overflow-hidden text-ellipsis w-full line-clamp-1 text-[#161616] max-w-[calc(100%-75px)]">
        {element.title}
      </p>
      <p className="text-[11px] text-[#6F6F6F]">#{designerBtnLabel}</p>
    </div>
  );
});

function FormComponent({ elementInstance }: { elementInstance?: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const description = element.questionPropertyList.find((el) => el.questionPropertyEnum === 'DESCRIPTION')?.value;

  return (
    <Box width="100%" maxWidth="1000px">
      <Typography sx={{ marginBottom: '2rem', fontSize: { xs: 15, sm: 16 }, fontWeight: '600', textAlign: 'justify' }}>
        {element.title}
      </Typography>
      {description && (
        <Typography sx={{ fontSize: '12px', fontWeight: '500', marginTop: '2rem', textAlign: 'justify' }} variant="subtitle2">
          {description}
        </Typography>
      )}
    </Box>
  );
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;

  const [openDescriptionSwitch, setOpenDescriptionSwitch] = useState<boolean>(() =>
    element.questionPropertyList.some((property) => property.questionPropertyEnum === 'DESCRIPTION' && property.value),
  );

  const searchParams = useSearchParams();
  const search = searchParams.get('admin');
  const isSurvey = search === 'survey' || search === 'data-collection';

  const defaultValues = useMemo(() => {
    const values = element.questionPropertyList.reduce((acc: any, attribute: any) => {
      acc[attribute.questionPropertyEnum] = {
        value:
          attribute.questionPropertyEnum === 'REQUIRED' || attribute.questionPropertyEnum === 'EDIT_ANSWER_LOCKED'
            ? attribute.value === 'true'
            : (attribute.value ?? ''),
        id: attribute.id,
      };
      return acc;
    }, {});
    values.title = element.title;
    values.label = element.label ?? null;
    values.questionType = element.questionType === 'AUDIO_UPLOAD' ? 'AUDIO_UPLOAD' : 'IMAGE_UPLOAD';
    return values;
  }, []);

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onSubmit',
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  async function onSubmit() {}

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} formId={FIELD_PROPERTIES_FORM_ID}>
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
          <Typography variant="subtitle2" fontWeight="700">
            متن سوال:
          </Typography>
          <RHFTextField multiline rows={3} name="title" />
        </Stack>
        {isSurvey && (
          <Stack spacing={1} mt={1}>
            <Typography variant="subtitle2" fontWeight="700">
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
              <RHFTextField name="label" dir="ltr" />
            </Box>
          </Stack>
        )}

        <Stack spacing={1} marginTop={2.5}>
          <Typography variant="subtitle2" fontWeight="700">
            نوع فایل:
          </Typography>
          <RHFMultiSelect name="questionType" options={mediaTypeOptions} />
        </Stack>

        <Stack flexDirection="row" justifyContent="space-between" alignItems="flex-start" marginTop={3}>
          <Typography variant="subtitle2" fontWeight="700">
            پاسخ به سوال اجباری باشد
          </Typography>
          <RHFSwitch label="" name="REQUIRED.value" labelPlacement="start" sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }} />
        </Stack>

        <Stack flexDirection="row" justifyContent="space-between" alignItems="flex-start" marginTop={1.5}>
          <Typography variant="subtitle2" fontWeight="700">
            پاسخ غیر قابل ویرایش
          </Typography>
          <RHFSwitch label="" name="EDIT_ANSWER_LOCKED.value" labelPlacement="start" sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }} />
        </Stack>

        <Stack spacing={1} marginTop={0.5} flexDirection="row" justifyContent="space-between" alignItems="flex-end">
          <Typography variant="subtitle2" fontWeight="700">
            توضیحات
          </Typography>
          <SwitchButton onChange={() => setOpenDescriptionSwitch((prev) => !prev)} checked={openDescriptionSwitch} />
        </Stack>

        {openDescriptionSwitch && (
          <Stack marginTop={2}>
            <Typography variant="subtitle2" fontWeight="700" marginBottom={1.5}>
              متن توضیح:
            </Typography>
            <RHFTextField name="DESCRIPTION.value" placeholder="پیامی برای توضیح بیشتر در مورد این سوال" />
          </Stack>
        )}

        <FieldDialogActionBottomButtons status={isSubmitting} />
      </Box>
    </FormProvider>
  );
}

export const MediaUploadFormElement: FormElement = {
  questionType,
  construct: ({ questionId, questionGroupId, formId, title, position }: IFormElementConstructor) => ({
    questionId,
    questionGroupId,
    formId,
    title,
    questionType,
    position,
    questionPropertyList,
  }),
  designerBtnElement: {
    label: 'صوتی و تصویری',
    icon: VideoPlayIcon,
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: (formElement: FormElementInstance, currentValue: string): boolean => {
    const element = formElement as CustomInstance;
    const required = element.questionPropertyList.find((el) => el.questionPropertyEnum === 'REQUIRED')?.value === 'true';
    return required ? currentValue.length > 0 : true;
  },
};
