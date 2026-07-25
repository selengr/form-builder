'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { memo, useEffect, useMemo, useState } from 'react';
import { ElementsType, FormElement, FormElementInstance } from '@/types/FormElements';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import FormProvider from '@/components/hook-form/FormProvider';
import { FIELD_PROPERTIES_FORM_ID } from '@/constants/fieldDialog';
import { RHFSwitch, RHFTextField, RHFTextFieldOptionList } from '../../components/hook-form';
import FieldDialogActionBottomButtons from '../FieldDialogActionBottomButtons/FieldDialogActionBottomButtons';
import { SwitchButton } from '../Switch/SwitchButton';
import { IFormElementConstructor, IFormOptionList, IQPLMultipleChoice } from '@/types/bulider';
import TickIcon from '@/../public/images/home-page/tick-square.svg';
import useDesigner from '@/hooks/useDesigner';
import useElements from '@/hooks/useElements';
import useActionOpenDialog from '@/hooks/useActionOpenDialog';
import useActionSelectedElement from '@/hooks/useActionSelectedElement';
import useSelectedElement from '@/hooks/useSelectedElement';
import useActionDesigner from '@/hooks/useActionDesigner';
import shuffleArray from '@/lib/shuffle';
import { useSearchParams } from 'next/navigation';
// actions
import { createQuestionAction, updateQuestionAction } from '../../../actions/builder/question';

const questionType: ElementsType = 'MULTIPLE_CHOICE';

const questionPropertyList: IQPLMultipleChoice = [
  {
    id: 1,
    questionPropertyEnum: 'MULTI_SELECT',
    value: 'false',
  },
  {
    id: 2,
    questionPropertyEnum: 'REQUIRED',
    value: 'false',
  },
  {
    id: 3,
    questionPropertyEnum: 'RANDOMIZE_OPTIONS',
    value: 'false',
  },
  {
    id: 4,
    questionPropertyEnum: 'DESCRIPTION',
    value: '',
  },
  {
    id: 5,
    questionPropertyEnum: 'EDIT_ANSWER_LOCKED',
    value: 'false',
  },
];

const optionList: IFormOptionList[] = [
  {
    title: 'گزینه 1',
    score: 1,
  },
  {
    title: 'گزینه 2',
    score: 2,
  },
];

const optionsSchema = z.object({
  title: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, ' '))
    .pipe(
      z
        .string()
        .min(1, {
          message: 'هر گزینه حداقل باید 1 و حداکثر 50 کاراکتر داشته باشد',
        })
        .max(500, {
          message: 'هر گزینه حداقل باید 1 و حداکثر 500 کاراکتر داشته باشد',
        }),
    ),
  score: z.number(),
  id: z.number().nullable().default(null),
});

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
  RANDOMIZE_OPTIONS: z.object({
    value: z.boolean().default(false),
    id: z.number(),
  }),
  MULTI_SELECT: z.object({
    value: z.boolean().default(false),
    id: z.number(),
  }),
  optionList: z.array(optionsSchema).min(2, { message: 'حداقل باید 2 و حداکثر 10 گزینه وجود داشته باشد' }).max(10, { message: 'حداقل باید 2 و حداکثر 10 گزینه وجود داشته باشد' }),
});

const DesignerComponent = memo(function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const labelText = element.title;
  const designerBtnLabel = MultipleChoiceFormElement.designerBtnElement.label;

  return (
    <div className="flex items-start flex-col overflow-hidden min-w-0 w-full max-w-[90%]" dir="rtl">
      <p dir="rtl" className="text-[13px] overflow-hidden text-ellipsis w-full line-clamp-1 text-[#161616] max-w-[calc(100%-75px)]">
        {labelText}
      </p>
      <p className="text-[11px] text-[#6F6F6F]">#{designerBtnLabel}</p>
    </div>
  );
});

export const MultipleChoiceFormElement: FormElement = {
  questionType,
  construct: ({ questionId, questionGroupId, formId, title, position }: IFormElementConstructor) => ({
    questionId,
    questionGroupId,
    formId,
    title,
    questionType,
    position,
    questionPropertyList: questionPropertyList,
    optionList: optionList,
  }),
  designerBtnElement: {
    label: 'چند گزینه‌ای',
    icon: TickIcon,
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
  optionList: typeof optionList;
};

function FormComponent({ elementInstance, onChange, error, value }: { elementInstance?: FormElementInstance; onChange?: (value: string) => void; error?: string; value?: any }) {
  const element = elementInstance as CustomInstance;
  const isMultipleChoiceSelectionAllowed = element?.questionPropertyList?.find((el: any) => el?.questionPropertyEnum === 'MULTI_SELECT')?.value === 'true';
  const description = element?.questionPropertyList?.find((el) => el?.questionPropertyEnum === 'DESCRIPTION')?.value;
  const randomOptions = element?.questionPropertyList?.find((el) => el?.questionPropertyEnum === 'RANDOMIZE_OPTIONS')?.value === 'true';

  const [newOptionList] = useState(randomOptions ? shuffleArray(element?.optionList).slice() : element?.optionList.slice());

  const getInitialValue = () => {
    if (!value) return isMultipleChoiceSelectionAllowed ? [] : '';

    if (Array.isArray(value)) {
      if (value[0] && typeof value[0] === 'object' && 'optionId' in value[0]) {
        return value.map((v) => String(v.optionId));
      }
      return value.map((v) => String(v));
    }

    if (typeof value === 'object' && value.optionId) {
      return String(value.optionId);
    }

    return String(value);
  };

  const [selectedValue, setSelectedValue] = useState<any>(getInitialValue());

  // فقط وقتی value تغییر کرد و با selectedValue فرق داشت، مقدار رو آپدیت کن
  useEffect(() => {
    const newValue = getInitialValue();
    if ((Array.isArray(newValue) && JSON.stringify(newValue) !== JSON.stringify(selectedValue)) || (!Array.isArray(newValue) && newValue !== selectedValue)) {
      setSelectedValue(newValue);
    }
  }, [value]);

  const handleChange = (event: any) => {
    const { value } = event.target;

    if (isMultipleChoiceSelectionAllowed) {
      setSelectedValue((prevSelected: any) => {
        if (prevSelected.includes(value)) {
          return prevSelected.filter((id: any) => id !== value);
        } else {
          return [...prevSelected, value];
        }
      });
    } else {
      setSelectedValue(value);
    }
  };

  useEffect(() => {
    onChange?.(selectedValue);
  }, [selectedValue, onChange]);

  return (
    <FormControl sx={{ maxWidth: '750px' }}>
      <FormLabel
        sx={{
          marginBottom: '2rem',
          fontWeight: '600',
          color: '#353535',
          fontSize: { xs: 15, sm: 16 },
          '&.MuiFormLabel-root.MuiFormLabel-colorPrimary.Mui-focused': {
            color: '#353535',
          },
          textAlign: "justify"
        }}
        id={String(element?.questionId)}>
        {element.title}
      </FormLabel>

      {isMultipleChoiceSelectionAllowed ? (
        <>
          <FormGroup>
            {newOptionList?.map((option: any) => (
              <FormControlLabel key={option?.id} value={String(option?.id)} onChange={handleChange} control={<Checkbox checked={selectedValue?.includes(String(option.id))} />} label={option?.title} />
            ))}
          </FormGroup>
          {!!error && <Typography color='#f44336'>{error}</Typography>}
        </>
      ) : (
        <>
          <RadioGroup name={String(element?.questionId)}>
            {newOptionList?.map((option: any) => (
              <FormControlLabel key={option?.id} value={String(option?.id)} onChange={handleChange} control={<Radio checked={selectedValue == String(option.id)} />} label={option?.title} />
            ))}
          </RadioGroup>
          {!!error && <Typography color='#f44336'>{error}</Typography>}
        </>
      )}
      {description && (
        <Typography sx={{ fontSize: '12px', fontWeight: '500', marginTop: '2rem' }} variant='subtitle2'>
          {description}
        </Typography>
      )}
    </FormControl>
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
  const search = searchParams.get('admin');
  const isSurvey = search === 'survey' || search === 'data-collection';

  const defaultValues = useMemo(() => {
    const values = element.questionPropertyList.reduce((acc: any, attribute: any) => {
      if (!acc[attribute.questionPropertyEnum]) {
        acc[attribute.questionPropertyEnum] = {};
      }

      if (
        attribute.questionPropertyEnum === 'REQUIRED' ||
        attribute.questionPropertyEnum === 'RANDOMIZE_OPTIONS' ||
        attribute.questionPropertyEnum === 'MULTI_SELECT' ||
        attribute.questionPropertyEnum === 'EDIT_ANSWER_LOCKED'
      ) {
        acc[attribute.questionPropertyEnum].value = attribute.value === 'true';
      } else if (attribute.questionPropertyEnum === 'DESCRIPTION') {
        acc[attribute.questionPropertyEnum].value = attribute.value === null ? '' : attribute.value;
      } else {
        acc[attribute.questionPropertyEnum].value = attribute.value;
      }

      acc[attribute.questionPropertyEnum].id = attribute.id;

      return acc;
    }, {});

    values.title = element?.title;
    values.label = element.label ?? null;
    values.optionList = element?.optionList;

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
    formState: { isSubmitting, errors },
  } = methods;

  async function onSubmit(values: propertiesFormSchemaType) {
    const { title, label, DESCRIPTION, REQUIRED, RANDOMIZE_OPTIONS, MULTI_SELECT, optionList, EDIT_ANSWER_LOCKED } = values;

    // ? finds whether a field is selected or not
    const selectedYet = elements?.find((el: any) => el?.questionId === element?.questionId);

    const propertiesData = [
      {
        questionPropertyEnum: 'MULTI_SELECT',
        value: MULTI_SELECT.value ? 'true' : 'false',
        id: selectedYet ? MULTI_SELECT.id : null,
      },
      {
        questionPropertyEnum: 'RANDOMIZE_OPTIONS',
        value: RANDOMIZE_OPTIONS.value ? 'true' : 'false',
        id: selectedYet ? RANDOMIZE_OPTIONS.id : null,
      },
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

    const optionListData = [...optionList];

    const lastIndexOfGroup = elements.findLastIndex((el: any) => el.questionGroupId === selectedElement?.fieldElement?.questionGroupId);

    const group = elements.filter((el: any) => el.questionGroupId === selectedElement?.fieldElement?.questionGroupId);

    let findSelectedGroupPreviousGroup = questionGroups.findIndex((el: any) => el === selectedElement?.fieldElement?.questionGroupId) - 1;

    // if the selected group was the index 0
    // because we are subtracting it by 1 we have
    // to set it back to zero
    if (findSelectedGroupPreviousGroup === -1) {
      findSelectedGroupPreviousGroup = 0;
    }

    // The application of this is when there is a empty group
    // so there is no corresponding question related to it
    // exist in elements array so we find the last index of its
    // prevoius group and add one item after that
    const firstIndexAfterThePreviousSelectedGroup = elements.findLastIndex((el: any) => el.questionGroupId === questionGroups[findSelectedGroupPreviousGroup]) + 1;

    delete element.temp;

    const finalFieldData = {
      ...element,
      title,
      position: selectedElement?.position?.apiPosition ?? group.length,
      questionPropertyList: propertiesData,
      optionList: optionListData,
      label: label ?? null,
    };

    if (!selectedYet) {
      const removeId: any = { ...finalFieldData };
      delete removeId.questionId;

      try {
        const res = await createQuestionAction(removeId as any);

        if (!res.success) {
          toast.error(res.message || 'انجام عملیات با خطا مواجه شد');
          return;
        }
        const data = res.data
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
        const res = await updateQuestionAction(String(finalFieldData?.questionId), finalFieldData);
        if (!res.success) {
          toast.error(res.message || 'انجام عملیات با خطا مواجه شد');
          return;
        }
        const data = res.data
        delete data.questionPropertyList;
        delete data.optionList;
        delete data.spectralPlaceList;
        const newData = {
          ...data,
        };
        updateElement(element?.questionId, newData);
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
              <RHFTextField name='label' dir='ltr' />
            </Box>
          </Stack>
        }

        <Stack>
          <Box display='flex' justifyContent='space-between' alignItems='center' marginTop={3} marginBottom={0.5}>
            <Typography sx={{ width: '75%' }} fontWeight='700'>
              گزینه‌ها:
            </Typography>
            <Typography sx={{ width: '12.5%' }} fontWeight='700'>
              ارزش:
            </Typography>
            <Typography sx={{ width: '12.5%' }}></Typography>
          </Box>
          <RHFTextFieldOptionList name='optionList' errorMessage={errors?.optionList?.root?.message} />
        </Stack>

        <Stack flexDirection='row' justifyContent='space-between' alignItems='flex-start' marginTop={3}>
          <Typography variant='subtitle2' fontWeight='700'>
            چند انتخابی
          </Typography>
          <RHFSwitch label='' name='MULTI_SELECT.value' labelPlacement='start' sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }} />
        </Stack>

        <Stack flexDirection='row' justifyContent='space-between' alignItems='flex-start' marginTop={1.5}>
          <Typography variant='subtitle2' fontWeight='700'>
            پاسخ به سوال اجباری باشد
          </Typography>
          <RHFSwitch label='' name='REQUIRED.value' labelPlacement='start' sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }} />
        </Stack>

        <Stack flexDirection='row' justifyContent='space-between' alignItems='flex-start' marginTop={1.5}>
          <Typography variant='subtitle2' fontWeight='700'>
            توزیع تصادفی گزینه‌ها
          </Typography>
          <RHFSwitch label='' name='RANDOMIZE_OPTIONS.value' labelPlacement='start' sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }} />
        </Stack>

        <Stack flexDirection='row' justifyContent='space-between' alignItems='flex-start' marginTop={1.5}>
          <Typography variant='subtitle2' fontWeight='700'>
            پاسخ غیر قابل ویرایش
          </Typography>
          <RHFSwitch label='' name='EDIT_ANSWER_LOCKED.value' labelPlacement='start' sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }} />
        </Stack>

        <Stack marginTop={1.5} flexDirection='row' justifyContent='space-between' alignItems='flex-start'>
          <Typography variant='subtitle2' fontWeight='700'>
            توضیحات
          </Typography>
          <SwitchButton onChange={() => setOpenDescriptionSwitch((prev) => !prev)} checked={openDescriptionSwitch} />
        </Stack>

        {openDescriptionSwitch && (
          <Stack marginTop={2}>
            <Typography fontWeight='700' variant='subtitle2' marginBottom={1.5}>
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
