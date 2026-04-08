'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import Box from '@mui/material/Box';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import FormProvider from '@/components/hook-form/FormProvider';
import { RHFSwitch, RHFTextField } from '@/components/hook-form';
import FieldDialogActionBottomButtons from '../FieldDialogActionBottomButtons/FieldDialogActionBottomButtons';

import useDesigner from '@/hooks/useDesigner';
import useElements from '@/hooks/useElements';
import useActionOpenDialog from '@/hooks/useActionOpenDialog';
import useActionSelectedElement from '@/hooks/useActionSelectedElement';
import useSelectedElement from '@/hooks/useSelectedElement';
import useActionDesigner from '@/hooks/useActionDesigner';

import InformationIcon from '@/../public/images/home-page/information.svg';
import { ElementsType, FormElement, FormElementInstance } from '@/types/FormElements';
import { IFormElementConstructor, IQPLInfoField } from '@/types/bulider';
// actions
import { createQuestionAction, updateQuestionAction } from '../../../actions/builder/question';

const questionType: ElementsType = 'INFO_FIELD';

const questionPropertyList: IQPLInfoField = [
  { id: 1, questionPropertyEnum: 'MESSAGE', value: '' },
  { id: 2, questionPropertyEnum: 'THE_END', value: 'false' },
];

const propertiesSchema = z.object({
  title: z.string().trim().min(1, 'حداقل باید 1 و حداکثر 4000 کاراکتر باشد').max(3999),
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
  MESSAGE: z.object({
    value: z.string().max(3999, 'حداکثر میتواند 4000 کاراکتر باشد').optional(),
    id: z.number(),
  }),
  THE_END: z.object({
    value: z.boolean().default(false),
    id: z.number(),
  }),
});

type CustomInstance = FormElementInstance & { questionPropertyList: typeof questionPropertyList };
type PropertiesFormValues = z.infer<typeof propertiesSchema>;

// eslint-disable-next-line react/display-name
const DesignerComponent = React.memo(({ elementInstance }: { elementInstance: FormElementInstance }) => {
  const element = elementInstance as CustomInstance;

  return (
    <div className='flex items-start flex-col overflow-hidden absolute' dir='rtl' style={{ width: 'calc(100% - 96px)' }}>
      <p dir='rtl' className='text-base overflow-hidden text-ellipsis w-full' style={{ textWrap: 'nowrap', fontWeight: 700 }}>
        {element.title}
      </p>
      <p className='text-xs text-[#424242]'>#بخش راهنما</p>
    </div>
  );
});

function formatTextWithLinksAndLineBreaks(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  const escaped = text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>')
    .replace(urlRegex, (match) => {
      const href = match.startsWith('http') ? match : `https://${match}`;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:#1e88e5;">${match}</a>`;
    });

  return escaped;
}

function FormComponent({ elementInstance }: { elementInstance?: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const message = element.questionPropertyList.find((el) => el.questionPropertyEnum === 'MESSAGE')?.value;

  return (
    <Box display='flex' gap={1} flexDirection='column' width='100%' maxWidth='600px'>
      <Typography sx={{ marginRight: 3, fontWeight: 600, fontSize: 18 }}>{element.title}</Typography>
      {message && (
        <Typography
          sx={{
            marginRight: 3,
            fontWeight: 600,
            fontSize: 16,
            whiteSpace: 'pre-line',
          }}
          component='div'
          dangerouslySetInnerHTML={{ __html: formatTextWithLinksAndLineBreaks(message) }}
        />
      )}
    </Box>
  );
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const elements = useElements();
  const setOpenDialog = useActionOpenDialog();
  const setSelectedElement = useActionSelectedElement();
  const selectedElement = useSelectedElement();
  const { updateElement, addElement } = useActionDesigner();
  const { questionGroups } = useDesigner();

  const searchParams = useSearchParams();
  const search = searchParams.get('admin');
  const isSurvey = search === 'survey' || search === 'data-collection';

  const defaultValues = useMemo(() => {
    const values = element.questionPropertyList.reduce((acc: any, attr) => {
      acc[attr.questionPropertyEnum] = {
        value: attr.questionPropertyEnum === 'THE_END' ? attr.value === 'true' : (attr.value ?? ''),
        id: attr.id,
      };
      return acc;
    }, {});
    values.title = element.title;
    values.label = element.label ?? null;
    return values;
  }, [element]);

  const methods = useForm<PropertiesFormValues>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onChange',
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (values: PropertiesFormValues) => {
    const selected = elements.find((el) => el.questionId === element.questionId);

    const props = [
      {
        questionPropertyEnum: 'THE_END',
        value: values.THE_END?.value ? 'true' : 'false',
        id: selected ? values.THE_END.id : null,
      },
      {
        questionPropertyEnum: 'MESSAGE',
        value: values.MESSAGE?.value ?? '',
        id: selected ? values.MESSAGE.id : null,
      },
    ];

    const groupId = selectedElement?.fieldElement?.questionGroupId;
    const groupElements = elements.filter((el) => el.questionGroupId === groupId);

    const prevGroupIdx = Math.max(questionGroups.findIndex((q) => q === groupId) - 1, 0);

    const insertIdx = elements.findLastIndex((el) => el.questionGroupId === questionGroups[prevGroupIdx]) + 1;

    const newField = {
      questionId: selected ? element.questionId : undefined,
      questionType: element.questionType,
      formId: element.formId,
      questionGroupId: element.questionGroupId,
      position: selectedElement?.position?.apiPosition ?? groupElements.length,
      title: values.title,
      questionPropertyList: props,
      label: values.label ?? null,
    };

    try {
      if (!selected) {
        const { data } = await createQuestionAction(newField);
        addElement(selectedElement?.position?.realPosition ?? insertIdx, data);
      } else {
          const { data } = await updateQuestionAction(String(element.questionId), newField);
          updateElement(element.questionId, data);
      }

      setOpenDialog(false);
      setSelectedElement(null);
      reset();
      } catch (error:any) {
         toast.error( error?.message || 'انجام عملیات با خطا مواجه شد');
      }
  };

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
          <Typography variant='subtitle2' fontWeight={700}>
            عنوان راهنما:
          </Typography>
          <Box sx={{ px: 0.5, '& .MuiFormControl-root, & .MuiInputBase-root': { borderRadius: '10px' } }}>
            <RHFTextField name='title' />
          </Box>
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

        <Stack mt={2}>
          <Typography variant='subtitle2' fontWeight={700} mb={1.5}>
            متن راهنما:
          </Typography>
          <Box sx={{ px: 0.5, '& .MuiFormControl-root, & .MuiInputBase-root': { borderRadius: '10px' } }}>
            <RHFTextField multiline minRows={3} maxRows={6} name='MESSAGE.value' placeholder='متن راهنمای خود را بنویسید.' />
          </Box>
        </Stack>

        <Stack direction='row' justifyContent='space-between' alignItems='flex-start' mt={3}>
          <Typography variant='subtitle2' fontWeight={700}>
            به جای صفحه پایان باشد
          </Typography>
          <RHFSwitch label='' name='THE_END.value' labelPlacement='start' sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }} />
        </Stack>

        <FieldDialogActionBottomButtons status={isSubmitting} />
      </Box>
    </FormProvider>
  );
}

export const InfoFieldFormElement: FormElement = {
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
  designerBtnElement: { label: 'بخش راهنما', icon: InformationIcon },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement, currentValue) => {
    const element = formElement as CustomInstance;
    return !element.questionPropertyList.required || currentValue.length > 0;
  },
};
