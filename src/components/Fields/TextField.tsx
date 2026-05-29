'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { memo, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ElementsType, FormElement, FormElementInstance } from '@/types/FormElements';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormProvider from '../../components/hook-form/FormProvider';
import { RHFSwitch, RHFTextField } from '../../components/hook-form';
import FieldDialogActionBottomButtons from '../FieldDialogActionBottomButtons/FieldDialogActionBottomButtons';
import { IFormElementConstructor, IQPLTextField } from '@/types/bulider';
import useDesigner from '@/hooks/useDesigner';
import useElements from '@/hooks/useElements';
import useActionOpenDialog from '@/hooks/useActionOpenDialog';
import useActionSelectedElement from '@/hooks/useActionSelectedElement';
import useSelectedElement from '@/hooks/useSelectedElement';
import useActionDesigner from '@/hooks/useActionDesigner';
import TextBlockIcon from '@/../public/images/home-page/text-block.svg';
import DatePicker from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/layouts/mobile.css';
import { SwitchButton } from '../Switch/SwitchButton';
import TextFieldPair from '../TextFieldPair/TextFieldPair';
import TimePickerStyled, { DatePickerWrapper } from '../SettingsDialog/TimePicker.styled';
import TimePicker from 'react-multi-date-picker/plugins/analog_time_picker';
import { GoClock } from 'react-icons/go';
import { BsCalendarDate } from 'react-icons/bs';
import { DatePicker as DatePickerCustome } from '../DatePicker/DatePicker';
// actions
import { createQuestionAction, updateQuestionAction } from '../../../actions/builder/question';
import { commonTextFieldSx } from './formStyles';

const questionType: ElementsType = 'TEXT_FIELD';

const questionPropertyList: IQPLTextField = [
  {
    id: 1,
    questionPropertyEnum: 'TEXT_FIELD_PATTERN',
    value: 'SHORT_TEXT',
  },
  {
    id: 2,
    questionPropertyEnum: 'REQUIRED',
    value: 'false',
  },
  {
    id: 3,
    questionPropertyEnum: 'DESCRIPTION',
    value: '',
  },
  {
    id: 4,
    questionPropertyEnum: 'MINIMUM_LEN',
    value: 0,
  },
  {
    id: 5,
    questionPropertyEnum: 'MAXIMUM_LEN',
    value: 250,
  },
  {
    id: 6,
    questionPropertyEnum: 'EDIT_ANSWER_LOCKED',
    value: 'false',
  },
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
    MINIMUM_LEN: z.object({
      value: z.number({ invalid_type_error: 'اجباری است' }).min(0),
      id: z.number(),
    }),
    MAXIMUM_LEN: z.object({
      value: z.number({ invalid_type_error: 'اجباری است' }).min(1, { message: 'حداقل باید 1 کاراکتر باشد' }),
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
    REQUIRED: z.object({
      value: z.boolean().default(false),
      id: z.number(),
    }),
    EDIT_ANSWER_LOCKED: z.object({
      value: z.boolean().default(false),
      id: z.number(),
    }),
    TEXT_FIELD_PATTERN: z.object({
      value: z.string().min(1, { message: 'الزامی است' }),
      id: z.number(),
    }),
  })
  .refine((val) => val.MAXIMUM_LEN.value >= val.MINIMUM_LEN.value, {
    message: 'حداکثر باید از حداقل بیشتر باشد',
    path: ['MAXIMUM_LEN.value'],
  })
  .refine(
    (val) => {
      if (val.TEXT_FIELD_PATTERN.value === 'LONG_TEXT') {
        return val.MAXIMUM_LEN.value <= 3999;
      }
      return true;
    },
    {
      message: 'حداکثر طول برای متنی بلند باید 4000 کاراکتر باشد',
      path: ['MAXIMUM_LEN.value'],
    },
  )
  .refine(
    (val) => {
      if (val.TEXT_FIELD_PATTERN.value === 'SHORT_TEXT') {
        return val.MAXIMUM_LEN.value <= 3999;
      }
      return true;
    },
    {
      message: 'حداکثر طول برای متنی ساده باید 4000 کاراکتر باشد',
      path: ['MAXIMUM_LEN.value'],
    },
  );

type CustomInstance = FormElementInstance & {
  questionPropertyList: typeof questionPropertyList;
};

const DesignerComponent = memo(function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const labelText = element.title;
  const designerBtnLabel = TextFieldFormElement.designerBtnElement.label;

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

const FormComponent = memo(function FormComponent({
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

  const fieldPattern = element.questionPropertyList.find((el) => el.questionPropertyEnum === 'TEXT_FIELD_PATTERN')?.value;
  const description = element.questionPropertyList.find((el) => el.questionPropertyEnum === 'DESCRIPTION')?.value;
  const min = element.questionPropertyList.find((el) => el.questionPropertyEnum === 'MINIMUM_LEN')?.value;
  const max = element.questionPropertyList.find((el) => el.questionPropertyEnum === 'MAXIMUM_LEN')?.value;

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (fieldPattern === 'DATE') {
      onChange?.(e as any);
    } else {
      const newValue = e?.target?.value;
      onChange?.(newValue);
    }
  };

  const commonTextFieldProps = {
    value: isPreview ? undefined : value,
    onChange: isPreview ? undefined : handleLocalChange,
    error: !!error,
    helperText: error,
    sx: commonTextFieldSx,
    fullWidth: true
  };

  const renderContent = () => {
    switch (fieldPattern) {
      case 'LONG_TEXT':
        return <TextField rows={4} multiline type='text' {...commonTextFieldProps} />;
      case 'SHORT_TEXT':
        return <TextField type='text' {...commonTextFieldProps} />;
      case 'NUMBER':
        return (
          <TextField
            type='text'
            slotProps={{
              htmlInput: {
                maxLength: 15,
                pattern: '^-?\\d*\\.?\\d*$',
                onInput: (e: any) => {
                  let newValue = e.target.value
                    .replace(/[^0-9.-]/g, '')
                    .replace(/(?!^)-/g, '')
                    .replace(/(\..*)\..*/g, '$1');

                  if (newValue.startsWith('.')) {
                    newValue = newValue.substring(1);
                  }

                  if (newValue.startsWith('-') && newValue.length > 1 && !/^\d/.test(newValue[1])) {
                    newValue = '-';
                  }

                  e.target.value = newValue;
                },
              },
            }}
            {...commonTextFieldProps}
          />
        );
      case 'NATIONAL_CODE':
        return (
          <TextField
            placeholder='##########'
            type='text'
            slotProps={{
              htmlInput: {
                maxLength: 10,
                pattern: '[0-9]*',
                onInput: (e: any) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                },
              },
            }}
            {...commonTextFieldProps}
          />
        );
      case 'PHONE':
        return (
          <TextField
            type='text'
            placeholder='09########'
            slotProps={{
              htmlInput: {
                maxLength: 11,
                pattern: '[0-9]*',
                onInput: (e: any) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                },
              },
            }}
            {...commonTextFieldProps}
          />
        );
     case 'DATE':
  return (
    <Box display='flex' flexDirection='column' gap={1} width='100%'>
      <DatePickerWrapper isError={!!error}>
        <DatePickerCustome 
          inputClass='picker-input' 
          value={value} 
          onChange={handleLocalChange as any} 
        />
        <BsCalendarDate size='1.4rem' className='calendar-icon' color='#424242' />
      </DatePickerWrapper>
      
      {!!error && (
        <Typography color='#d32f2f' variant="caption" sx={{ mt: 0.5, fontSize: '0.75rem' }}>
          {error}
        </Typography>
      )}
    </Box>
  );

      case 'TIME':
        return (
          <Box display='flex' justifyContent='flex-start' alignItems='center'>
            <TimePickerStyled>
              <Box display='flex' alignItems='center' height='56px' borderRadius='10px' border={!error ? '1px solid #d4d4d4' : '1px solid #f44336'} textAlign='center'>
                <DatePicker
                  disableDayPicker
                  format='HH:mm'
                  inputClass='w-full text-center font-bold'
                  containerClassName='w-full'
                  plugins={[<TimePicker key='1' hideSeconds />]}
                  value={isPreview ? undefined : value}
                  onChange={
                    isPreview
                      ? undefined
                      : (value: any) => {
                        const formattedValue = `${value.hour}:${value.minute}`;
                        onChange?.(formattedValue);
                      }
                  }
                />
                <GoClock size='2rem' className='ml-2' color='#424242' />
              </Box>
            </TimePickerStyled>
            {!!error && <Typography color='#f44336'>{error}</Typography>}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box display='flex' gap={1} flexDirection='column' width='100%' maxWidth='600px'>
      <Box display='flex' flexDirection='column' justifyContent='space-between' width='100%'>
        <Typography sx={{ fontSize:{ xs: 15, sm: 16 }, marginRight: '25px', fontWeight: '600', margin: 0, marginBottom : "2rem", textAlign: "justify" }}>{element.title}</Typography>
        {min && max ? (
          <Typography sx={{ fontSize: '12px', direction: 'rtl', textWrap: 'nowrap', fontWeight: '400' }} variant='subtitle2'>
            {min + ' / ' + max}
          </Typography>
        ) : null}
      </Box>
      {renderContent()}
      {description && (
        <Typography sx={{ fontSize: '12px', fontWeight: '600', marginTop : "2rem" }} variant='subtitle2'>
          {description}
        </Typography>
      )}
    </Box>
  );
});

export const TextFieldFormElement: FormElement = {
  questionType,
  construct: ({ questionId, questionGroupId, formId, title, position }: IFormElementConstructor) => ({
    questionId,
    questionGroupId,
    formId,
    title,
    questionType,
    position,
    questionPropertyList: questionPropertyList,
  }),
  designerBtnElement: {
    label: 'متنی',
    icon: TextBlockIcon,
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

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const [showMinMaxProps] = useState<boolean>(() => {
    const textFieldPatternVal = element.questionPropertyList.find((prop) => prop.questionPropertyEnum === 'TEXT_FIELD_PATTERN')?.value;

    return textFieldPatternVal === 'SHORT_TEXT' || textFieldPatternVal === 'LONG_TEXT';
  });
  const [openDescriptionSwitch, setOpenDescriptionSwitch] = useState<boolean>(() =>
    element.questionPropertyList.some((property) => {
      return property.questionPropertyEnum === 'DESCRIPTION' && property.value;
    }),
  );
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
    const values = element.questionPropertyList.reduce((acc: any, attribute) => {
      if (!acc[attribute.questionPropertyEnum]) {
        acc[attribute.questionPropertyEnum] = {};
      }

      if (attribute.questionPropertyEnum === 'REQUIRED' || attribute.questionPropertyEnum === 'EDIT_ANSWER_LOCKED') {
        acc[attribute.questionPropertyEnum].value = attribute.value === 'true';
      } else if (attribute.questionPropertyEnum === 'MINIMUM_LEN') {
        acc[attribute.questionPropertyEnum].value = attribute.value === '' || attribute.value === null ? 1 : Number(attribute.value);
      } else if (attribute.questionPropertyEnum === 'MAXIMUM_LEN') {
        acc[attribute.questionPropertyEnum].value = attribute.value === '' || attribute.value === null ? 250 : Number(attribute.value);
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
  }, [element]);

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onChange',
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { isSubmitting },
  } = methods;

  async function onSubmit(values: propertiesFormSchemaType) {
    const { title, label, DESCRIPTION, REQUIRED, TEXT_FIELD_PATTERN, MAXIMUM_LEN, MINIMUM_LEN, EDIT_ANSWER_LOCKED } = values;

    const selectedYet = elements?.find((el: any) => el?.questionId === element?.questionId);

    const isTextInputsSelected = TEXT_FIELD_PATTERN.value === 'SHORT_TEXT' || TEXT_FIELD_PATTERN.value === 'LONG_TEXT';

    const propertiesData = [
      {
        questionPropertyEnum: 'TEXT_FIELD_PATTERN',
        value: TEXT_FIELD_PATTERN.value,
        id: selectedYet ? TEXT_FIELD_PATTERN.id : null,
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
      {
        questionPropertyEnum: 'MAXIMUM_LEN',
        value: isTextInputsSelected ? MAXIMUM_LEN.value : null,
        id: selectedYet ? MAXIMUM_LEN.id : null,
      },
      {
        questionPropertyEnum: 'MINIMUM_LEN',
        value: isTextInputsSelected ? MINIMUM_LEN.value : null,
        id: selectedYet ? MINIMUM_LEN.id : null,
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
      position: selectedElement?.position?.apiPosition ?? group.length,
      questionPropertyList: propertiesData,
    };

    if (!selectedYet) {
      const removeId: any = { ...finalFieldData };
      delete removeId.questionId;

      try {
        const { data }: any = await createQuestionAction(removeId as any);
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
        const { data }: any = await updateQuestionAction(String(finalFieldData.questionId), finalFieldData);
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
            <RHFTextField multiline rows={3} name='title' />
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
              <RHFTextField name='label' dir='ltr' />
            </Box>
          </Stack>
        }

        <TextFieldPair setValue={setValue} clearErrors={clearErrors} initialShow={showMinMaxProps} />

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
          <SwitchButton disableRipple onChange={() => setOpenDescriptionSwitch((prev) => !prev)} checked={openDescriptionSwitch} />
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
