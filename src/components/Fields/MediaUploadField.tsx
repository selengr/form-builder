'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Stack, Typography } from '@mui/material';
// components
import { SwitchButton } from '../Switch/SwitchButton';
import { UppyUploader } from '@/components/uploader/UppyUploader';
import AudioRecorder from '@/components/uploader/AudioRecorder';
import type { IFileRestriction } from '@/components/uploader/types';
import FormProvider from '../../components/hook-form/FormProvider';
import { FIELD_PROPERTIES_FORM_ID } from '@/constants/fieldDialog';
import { RHFMultiSelect, RHFSwitch, RHFTextField } from '@/components/hook-form';
import FieldDialogActionBottomButtons from '../FieldDialogActionBottomButtons/FieldDialogActionBottomButtons';
// hook
import useDesigner from '@/hooks/useDesigner';
import useElements from '@/hooks/useElements';
import useActionDesigner from '@/hooks/useActionDesigner';
import useSelectedElement from '@/hooks/useSelectedElement';
import useActionOpenDialog from '@/hooks/useActionOpenDialog';
import useActionSelectedElement from '@/hooks/useActionSelectedElement';
// images
import VideoPlayIcon from '@/../public/images/home-page/video-play.svg';
// type
import { IFormElementConstructor, IQPLMediaUpload } from '@/types/bulider';
import type { ElementsType, FormElement, FormElementInstance } from '@/types/formElementTypes';
import { createQuestion, updateQuestion } from '@/lib/builderFieldActions';

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

const uploadRestrictions: Record<'IMAGE_UPLOAD' | 'AUDIO_UPLOAD', IFileRestriction> = {
  IMAGE_UPLOAD: {
    minNumberOfFiles: 1,
    maxNumberOfFiles: 1,
    allowedFileTypes: ['.jpeg', '.jpg', '.png'],
  },
  AUDIO_UPLOAD: {
    minNumberOfFiles: 1,
    maxNumberOfFiles: 1,
    allowedFileTypes: ['audio/*', '.mp3', '.wav', '.m4a', '.ogg', '.aac', '.webm'],
  },
};

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
  const tagLabel =
    mediaTypeOptions.find((option) => option.value === element.questionType)?.label ??
    MediaUploadFormElement.designerBtnElement.label;

  return (
    <div className="flex items-start flex-col overflow-hidden min-w-0 w-full max-w-[90%]" dir="rtl">
      <p dir="rtl" className="text-[13px] overflow-hidden text-ellipsis w-full line-clamp-1 text-[#161616] max-w-[calc(100%-75px)]">
        {element.title}
      </p>
      <p className="text-[11px] text-[#6F6F6F]">#{tagLabel}</p>
    </div>
  );
});

function FormComponent({
  elementInstance,
  value,
  onChange,
  error,
  isPreview = false,
}: {
  elementInstance?: FormElementInstance;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  isPreview?: boolean;
}) {
  const element = elementInstance as CustomInstance;
  const description = element.questionPropertyList.find((el) => el.questionPropertyEnum === 'DESCRIPTION')?.value;
  const isAudio = element.questionType === 'AUDIO_UPLOAD';
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [previewValue, setPreviewValue] = useState('');
  const uploadedId = isPreview ? previewValue : value;
  const uppyRef = useRef<any>(null);
  const [isRecordUploading, setIsRecordUploading] = useState(false);

  const handleUppyReady = (uppy: any) => {
    uppyRef.current = uppy;
    uppy.on('complete', () => setIsRecordUploading(false));
  };

  const handleRecordedSubmit = (file: File) => {
    const uppy = uppyRef.current;
    if (!uppy) return;
    try {
      uppy.cancelAll();
      uppy.addFile({ name: file.name, type: file.type, data: file, source: 'AudioRecorder' });
      setIsRecordUploading(true);
      uppy.upload();
    } catch (err: any) {
      setIsRecordUploading(false);
      toast.error(err?.message || 'خطا! بارگذاری انجام نشد');
    }
  };

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const handleUploaded = (ids: string[], files?: any[]) => {
    const id = ids[0] ?? '';
    const file = files?.[0]?.data;
    setLocalPreview(file instanceof Blob ? URL.createObjectURL(file) : null);
    if (isPreview) setPreviewValue(id);
    else onChange?.(id);
  };

  const handleReplace = () => {
    setLocalPreview(null);
    if (isPreview) setPreviewValue('');
    else onChange?.('');
  };

  return (
    <Box width="100%" maxWidth="600px" display="flex" flexDirection="column" gap={1}>
      <Typography sx={{ marginBottom: '2rem', fontSize: { xs: 15, sm: 16 }, fontWeight: '600', textAlign: 'justify' }}>
        {element.title}
      </Typography>

      {uploadedId ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.5,
            padding: 2,
            borderRadius: '12px',
            border: '1px solid #DDE1E6',
            backgroundColor: '#F7F7FF',
          }}>
          {localPreview && !isAudio && (
            <Box
              component="img"
              src={localPreview}
              alt=""
              sx={{ maxWidth: '100%', maxHeight: 240, borderRadius: '8px', objectFit: 'contain' }}
            />
          )}
          {localPreview && isAudio && <audio controls src={localPreview} style={{ width: '100%' }} />}
          <Typography sx={{ fontSize: '13px', color: '#2E7D32', fontWeight: 600 }}>
            {isAudio ? 'فایل صوتی بارگذاری شد' : 'تصویر بارگذاری شد'}
          </Typography>
          <Button
            variant="outlined"
            onClick={handleReplace}
            sx={{ borderRadius: '10px', borderColor: '#1758BA', color: '#1758BA', fontSize: '13px' }}>
            تغییر فایل
          </Button>
        </Box>
      ) : (
        <>
          <UppyUploader
            key={element.questionId}
            sx={{}}
            fileRestriction={uploadRestrictions[isAudio ? 'AUDIO_UPLOAD' : 'IMAGE_UPLOAD']}
            getData={handleUploaded}
            onUppyReady={handleUppyReady}
          />
          {isAudio && (
            <>
              <Typography sx={{ textAlign: 'center', fontSize: '13px', color: '#6F6F6F' }}>یا</Typography>
              <AudioRecorder uploading={isRecordUploading} onSubmit={handleRecordedSubmit} />
            </>
          )}
        </>
      )}

      {!!error && <Typography sx={{ color: '#d32f2f', fontSize: '0.75rem' }}>{error}</Typography>}

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
  const elements = useElements();
  const setOpenDialog = useActionOpenDialog();
  const setSelectedElement = useActionSelectedElement();
  const selectedElement = useSelectedElement();
  const { updateElement, addElement } = useActionDesigner();
  const { questionGroups } = useDesigner();

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
  }, [element]);

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onChange',
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  async function onSubmit(values: propertiesFormSchemaType) {
    const { title, label, questionType: selectedQuestionType, DESCRIPTION, REQUIRED, EDIT_ANSWER_LOCKED } = values;

    const selectedYet = elements?.find((el: any) => el?.questionId === element?.questionId);

    const propertiesData = [
      {
        questionPropertyEnum: 'REQUIRED',
        value: REQUIRED.value ? 'true' : 'false',
        id: selectedYet ? REQUIRED.id : null,
      },
      {
        questionPropertyEnum: 'EDIT_ANSWER_LOCKED',
        value: EDIT_ANSWER_LOCKED.value ? 'true' : 'false',
        id: selectedYet ? EDIT_ANSWER_LOCKED.id : null,
      },
      {
        questionPropertyEnum: 'DESCRIPTION',
        value: openDescriptionSwitch && DESCRIPTION.value ? DESCRIPTION.value : null,
        id: selectedYet ? DESCRIPTION.id : null,
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
      label: label ?? null,
      questionType: selectedQuestionType,
      position: selectedElement?.position?.apiPosition ?? group.length,
      questionPropertyList: propertiesData,
    };

    if (!selectedYet) {
      const removeId: any = { ...finalFieldData };
      delete removeId.questionId;

      try {
        const res = await createQuestion(removeId as any);
        if (!res.success) {
          toast.error(res.message || 'انجام عملیات با خطا مواجه شد');
          return;
        }
        const data = res.data;
        delete data.questionPropertyList;
        delete data.optionList;
        delete data.spectralPlaceList;
        const newData = {
          ...data,
        };

        const positionToUse = lastIndexOfGroup === -1 ? firstIndexAfterThePreviousSelectedGroup : lastIndexOfGroup + 1;
        addElement(selectedElement?.position?.realPosition ?? positionToUse, newData);

        setOpenDialog(false);
        setSelectedElement(null);
        reset();
      } catch (error: any) {
        toast.error(error?.message || 'انجام عملیات با خطا مواجه شد');
      }
    } else {
      try {
        const res = await updateQuestion(String(finalFieldData.questionId), finalFieldData);
        if (!res.success) {
          toast.error(res.message || 'انجام عملیات با خطا مواجه شد');
          return;
        }
        const data = res.data;
        delete data.questionPropertyList;
        delete data.optionList;
        delete data.spectralPlaceList;
        const newData = {
          ...data,
        };
        updateElement(element.questionId, newData);
        setOpenDialog(false);
        setSelectedElement(null);
        reset();
      } catch (error: any) {
        toast.error(error?.message || 'انجام عملیات با خطا مواجه شد');
      }
    }
  }

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

        <div className="flex flex-col gap-2 mt-5">
          <Typography variant="subtitle2" fontWeight="700">
            الگوی پاسخ:
          </Typography>
          <RHFMultiSelect name="questionType" options={mediaTypeOptions} />
        </div>

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
