'use client';

import { memo, useMemo, useState } from 'react';
import { ElementsType, FormElement, FormElementInstance } from '../../types/FormElements';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Stack, Typography } from '@mui/material';
import FormProvider from '../../components/hook-form/FormProvider';
import { RHFMultiSelect, RHFSwitch, RHFTextField, RHFTextFieldOptionList } from '@/components/hook-form';
import FieldDialogActionBottomButtons from '../FieldDialogActionBottomButtons/FieldDialogActionBottomButtons';
import { IFormElementConstructor, IFormOptionList, IQPLSpectral, ISpectralQTapAndOptionsType } from '@/types/bulider';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { AxiosApi } from '@/services/axios/AxiosApi';
import useElements from '@/hooks/useElements';
import useDesigner from '@/hooks/useDesigner';
import useActionOpenDialog from '@/hooks/useActionOpenDialog';
import useActionSelectedElement from '@/hooks/useActionSelectedElement';
import useSelectedElement from '@/hooks/useSelectedElement';
import useActionDesigner from '@/hooks/useActionDesigner';
import CheckIcon from '@/../public/images/home-page/spectral.svg';
import { SwitchButton } from '../Switch/SwitchButton';
import { MyRangeSlider } from '../Slider/RangeSlider';

const questionType: ElementsType = 'SPECTRAL';

const questionPropertyList: IQPLSpectral = [
  {
    questionPropertyEnum: 'SPECTRAL_TYPE',
    value: 'SPECTRAL',
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
    questionPropertyEnum: 'SELECTION_TYPE',
    value: 'CONTINUOUS',
    id: 4,
  },
  {
    questionPropertyEnum: 'STEP',
    value: 0.1,
    id: 5,
  },
  {
    questionPropertyEnum: 'SPECTRAL_START',
    value: 0,
    id: 6,
  },
  {
    questionPropertyEnum: 'SPECTRAL_END',
    value: 100,
    id: 7,
  },
  {
    id: 8,
    questionPropertyEnum: 'EDIT_ANSWER_LOCKED',
    value: 'false',
  },
];

const optionList: IFormOptionList[] = [
  {
    title: 'گزینه 1',
    score: 0,
    id: null,
  },
  {
    title: 'گزینه 2',
    score: 100,
    id: null,
  },
];
const spectralPlaceList: IFormOptionList[] = [
  {
    title: 'گزینه 1',
    score: 0,
    id: null,
  },
  {
    title: 'گزینه 2',
    score: 100,
    id: null,
  },
];

const tapTypeOptions: ISpectralQTapAndOptionsType = [
  { value: 'CONTINUOUS', label: 'پیوسته' },
  { value: 'DISCRETE', label: 'گسسته' },
];

const spectralTypeOptions: ISpectralQTapAndOptionsType = [
  { value: 'SPECTRAL', label: 'نقطه' },
  { value: 'DOMAIN', label: 'دامنه' },
];

const optionsSchema = z.object({
  title: z
    .string({ invalid_type_error: 'الزامی است' })
    .trim()
    .transform((value) => value.replace(/\s+/g, ' '))
    .pipe(
      z
        .string({ invalid_type_error: 'الزامی است' })
        .min(1, {
          message: 'برچسب باید حداقل 1 و حداکثر 20 کاراکتر باشد',
        })
        .max(20, {
          message: 'برچسب باید حداقل 1 و حداکثر 20 کاراکتر باشد',
        }),
    ),
    score: z.number({ invalid_type_error: 'مکان الزامی است' }).min(0, { message: 'نمیتواند منفی باشد' }).nonnegative({ message: 'نمیتواند منفی باشد' }),
    id: z.number().nullable().default(null),
});

const propertiesSchema = z
  .object({
    title: z
      .string()
      .trim()
      .transform((value) => value.replace(/\s+/g, ' '))
      .pipe(z.string().min(1, { message: 'حداقل باید 1 و حداکثر 4000 کاراکتر باشد' }).max(3999, { message: 'حداقل باید 1 و حداکثر 4000 کاراکتر باشد' })),
    SELECTION_TYPE: z.object({ value: z.string(), id: z.number() }),
    SPECTRAL_TYPE: z.object({ value: z.string(), id: z.number() }),
    STEP: z.object({
      value: z.number({ invalid_type_error: 'اجباری است' }).min(0.1, { message: 'باید از صفر بزرگتر باشد' }),
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
    SPECTRAL_START: z.object({
      value: z.number({ invalid_type_error: 'اجباری است' }).min(0, { message: 'نمیتواند منفی باشد' }).nonnegative({ message: 'نمیتواند منفی باشد' }),
      id: z.number(),
    }),
    SPECTRAL_END: z.object({
      value: z.number({ invalid_type_error: 'اجباری است' }).min(1, { message: 'حداقل باید 1 باشد' }).positive({ message: 'حداقل باید 1 باشد' }),
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
    optionList: z.array(optionsSchema).max(10, { message: 'حداکثر میتواند 10 برچسب وجود داشته باشد' }),
  })
  .refine((val) => val.SPECTRAL_END.value >= val.SPECTRAL_START.value, {
    message: 'پایان باید بزرگتر یا مساوی با شروع باشد',
    path: ['SPECTRAL_END.value'],
  })
  .refine(
    (val) => {
      if (val.SPECTRAL_END.value - val.SPECTRAL_START.value < val.STEP.value) return false;
      else return true;
    },
    {
      message: 'گام نمیتواند از پایان بیشتر باشد',
      path: ['STEP.value'],
    },
  )
  .refine(
    (val) => {
      const distance = val.SPECTRAL_END.value - val.SPECTRAL_START.value;
      if (val.SELECTION_TYPE.value === 'CONTINUOUS' || val.SELECTION_TYPE.value === 'DISCRETE') {
        if (Math.ceil(distance / val.STEP.value) + 1 < val.optionList.length) return false;
        else return true;
      }
    },
    {
      message: 'برچسب‌ها نمی‌توانند از تعداد گام بین شروع و پایان بیشتر باشند',
      path: ['optionList.optionList'],
    },
  )
  .refine(
    (val) => {
      const scores = val.optionList.map((option) => option.score);
      const uniqueScores = [...(new Set(scores) as any)];
      return scores.every((score) => score >= val.SPECTRAL_START.value && score <= val.SPECTRAL_END.value) && scores.length === uniqueScores.length;
    },
    {
      message: 'هر مکان در محدوده شروع و پایان طیف یا دامنه باید منحصر به فرد باشد',
      path: ['optionList.score'],
    },
  )
  .refine(
    (val) => {
      if (val.SELECTION_TYPE.value === 'DISCRETE') {
        return val.STEP.value >= 1 ? true : false;
      } else return true;
    },
    {
      message: 'گام گسسته نمیتواند از 1 کمتر باشد',
      path: ['STEP.value'],
    },
  );

const DesignerComponent = memo(function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const labelText = element.title;
  const designerBtnLabel = SpectralFormElement.designerBtnElement.label;

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

export const SpectralFormElement: FormElement = {
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
    label: 'طیفی',
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
  optionList: typeof optionList;
  spectralPlaceList: typeof spectralPlaceList;
};

function FormComponent({ elementInstance, value, onChange, error }: { elementInstance?: FormElementInstance; value?: string; onChange?: (value: string) => void; error?: string }) {
  const element = elementInstance as CustomInstance;
debugger
  const start: number = Number(element.questionPropertyList.find((el) => el.questionPropertyEnum === 'SPECTRAL_START')?.value);
  const end: number = Number(element.questionPropertyList.find((el) => el.questionPropertyEnum === 'SPECTRAL_END')?.value);
  const step: number = Number(element.questionPropertyList.find((el) => el.questionPropertyEnum === 'STEP')?.value);

  const selectionType = element.questionPropertyList.find((el) => el.questionPropertyEnum === 'SELECTION_TYPE')?.value;

  const spectralType = element.questionPropertyList.find((el) => el.questionPropertyEnum === 'SPECTRAL_TYPE')?.value;

  const marks = element.spectralPlaceList.map((option) => {
    return { value: option?.value, label: option.title };
  });

  const description = element.questionPropertyList.find((el) => el.questionPropertyEnum === 'DESCRIPTION')?.value;

  const [sliderVal, setSliderVal] = useState(value ? value : spectralType === 'SPECTRAL' ? start : [start, end]);

  const CustomValueLabel = ({ value }: { value: number }) => {
    const isMark = marks.some((mark) => mark.value === value);
    return <Box>{isMark ? <MdOutlineKeyboardArrowDown size={25} /> : <span>{value}</span>}</Box>;
  };

  const handleChange = (event: Event, newValue: number | number[]) => {
    setSliderVal(newValue as any);
    onChange?.(newValue as any);
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
      {spectralType === 'SPECTRAL' ? (
        <>
          <MyRangeSlider
            valueLabelFormat={(val: any) => <CustomValueLabel value={val} />}
            valueLabelDisplay='auto'
            value={sliderVal as any}
            step={step}
            onChange={handleChange}
            min={start}
            max={end}
            marks={marks}
          />
          {!!error && <Typography color='#f44336'>{error}</Typography>}
        </>
      ) : (
        <>
          <MyRangeSlider
            valueLabelFormat={(val: any) => <CustomValueLabel value={val} />}
            value={sliderVal as any}
            onChange={handleChange}
            size='medium'
            valueLabelDisplay='auto'
            step={selectionType === 'DISCRETE' ? step : 0.1}
            min={start}
            max={end}
            marks={marks}
            disableSwap
          />
          {!!error && <Typography color='#f44336'>{error}</Typography>}
        </>
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
  const [disableInput, setDisableInput] = useState<boolean>(() =>
    element.questionPropertyList.some((property) => property.questionPropertyEnum === 'SELECTION_TYPE' && property.value === 'CONTINUOUS'),
  );
  const [openDescriptionSwitch, setOpenDescriptionSwitch] = useState<boolean>(() =>
    element.questionPropertyList.some((property) => {
      return property.questionPropertyEnum === 'DESCRIPTION' && property.value;
    }),
  );

  const defaultValues = useMemo(() => {
    const values = element.questionPropertyList.reduce((acc: any, attribute: any) => {
      if (!acc[attribute.questionPropertyEnum]) {
        acc[attribute.questionPropertyEnum] = {};
      }

      if (attribute.questionPropertyEnum === 'REQUIRED' || attribute.questionPropertyEnum === 'EDIT_ANSWER_LOCKED') {
        acc[attribute.questionPropertyEnum].value = attribute.value === 'true';
      } else if (attribute.questionPropertyEnum === 'SPECTRAL_START' || attribute.questionPropertyEnum === 'SPECTRAL_END' || attribute.questionPropertyEnum === 'STEP') {
        acc[attribute.questionPropertyEnum].value = attribute.value === '' ? 0 : Number(attribute.value);
      } else if (attribute.questionPropertyEnum === 'DESCRIPTION') {
        acc[attribute.questionPropertyEnum].value = attribute.value === null ? '' : attribute.value;
      } else {
        acc[attribute.questionPropertyEnum].value = attribute.value;
      }

      acc[attribute.questionPropertyEnum].id = attribute.id;

      return acc;
    }, {});
    values.title = element.title;

    let optionList
    if (element.optionList.length > 0) {
      optionList = element.optionList
    } else {
      optionList = element?.spectralPlaceList?.map((item: any) => ({
        id: item.id ?? null,
        title: item.title,
        score: Number(item?.value),
      }));
    }

    values.optionList = optionList

    return values;
  }, []);

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onSubmit',
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    clearErrors,
    formState: { isSubmitting, errors },
  } = methods;

  async function onSubmit(values: propertiesFormSchemaType) {
    const { title, DESCRIPTION, REQUIRED, SPECTRAL_TYPE, SELECTION_TYPE, STEP, SPECTRAL_START, SPECTRAL_END, optionList, EDIT_ANSWER_LOCKED } = values;

    // ? finds whether a field is selected or not
    const selectedYet = elements?.find((el: any) => el?.questionId === element?.questionId);

    const propertiesData = [
      {
        questionPropertyEnum: 'SPECTRAL_TYPE',
        value: SPECTRAL_TYPE.value,
        id: selectedYet ? SPECTRAL_TYPE.id : null,
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
        questionPropertyEnum: 'SELECTION_TYPE',
        value: SELECTION_TYPE.value,
        id: selectedYet ? SELECTION_TYPE.id : null,
      },
      {
        questionPropertyEnum: 'STEP',
        value: SPECTRAL_TYPE.value !== 'CONTINUOUS' ? STEP.value : 0.1,
        id: selectedYet ? STEP.id : null,
      },
      {
        questionPropertyEnum: 'SPECTRAL_START',
        value: SPECTRAL_START.value,
        id: selectedYet ? SPECTRAL_START.id : null,
      },
      {
        questionPropertyEnum: 'SPECTRAL_END',
        value: SPECTRAL_END.value,
        id: selectedYet ? SPECTRAL_END.id : null,
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

    const updatedSpectralPlaceList = optionListData.map(option => {
      return {
        id : option.id || null,
        title: option.title,
        value: option.score
      };
    });

    const finalFieldData = {
      ...element,
      title,
      position: selectedElement?.position?.apiPosition ?? group.length,
      questionPropertyList: propertiesData,
      optionList: [],
      spectralPlaceList: updatedSpectralPlaceList,
    };

    if (!selectedYet) {
      const removeId: any = { ...finalFieldData };
      delete removeId.questionId;

      try {
        const { data }: any = await AxiosApi.post('/question', removeId as any);
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
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const { data }: any = await AxiosApi.put(`/question/${finalFieldData.questionId}`, finalFieldData);
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

        <Stack spacing={1} marginTop={2.5}>
          <Typography variant='subtitle2' fontWeight='700'>
            نوع پاسخ:
          </Typography>
          <RHFMultiSelect name='SPECTRAL_TYPE.value' options={spectralTypeOptions} />
        </Stack>

        <Stack spacing={1} marginTop={2.5}>
          <Typography variant='subtitle2' fontWeight='700'>
            مقیاس پاسخ:
          </Typography>
          <RHFMultiSelect setValue={setValue} name='SELECTION_TYPE.value' clearErros={clearErrors} options={tapTypeOptions} setProp={setDisableInput} />
        </Stack>

        <Box display='flex' gap={2} justifyContent='space-between' marginTop={2.5}>
          <Box width='100%'>
            <Typography variant='subtitle2' fontWeight='700'>
              شروع:
            </Typography>
            <RHFTextField name='SPECTRAL_START.value' type='number' />
          </Box>
          <Box width='100%'>
            <Typography variant='subtitle2' fontWeight='700'>
              پایان:
            </Typography>
            <RHFTextField name='SPECTRAL_END.value' type='number' />
          </Box>
          <Box width='100%'>
            <Typography variant='subtitle2' fontWeight='700'>
              گام:
            </Typography>
            <RHFTextField disabled={disableInput} name='STEP.value' type='number' changeValueToDefault={disableInput} />
          </Box>
        </Box>

        <Stack>
          <Box display='flex' justifyContent='space-between' alignItems='center' marginTop={3} marginBottom={0.5}>
            <Typography sx={{ width: '75%' }} fontWeight='700'>
              برچسب:
            </Typography>
            <Typography sx={{ width: '12.5%' }} fontWeight='700'>
              مکان:
            </Typography>
            <Typography sx={{ width: '12.5%' }}></Typography>
          </Box>
          <RHFTextFieldOptionList
            name='optionList'
            errorMessage={
              // @ts-ignore
              errors?.optionList?.root?.message ??
              // @ts-ignore
              errors?.optionList?.optionList?.message ??
              // @ts-ignore
              errors?.optionList?.score?.message
            }
          />
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
