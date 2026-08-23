'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ElementsType, FormElement, FormElementInstance } from '../../types/FormElements';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import FormProvider from '@/components/hook-form/FormProvider';
import { FIELD_PROPERTIES_FORM_ID } from '@/constants/fieldDialog';
import { RHFSwitch, RHFTextField } from '@/components/hook-form';
import FieldDialogActionBottomButtons from '../FieldDialogActionBottomButtons/FieldDialogActionBottomButtons';
import { IFormElementConstructor, IFormOptionList, IQPLMultipleChoice } from '@/types/bulider';
import { UppyUploader } from '@/components/uploader/UppyUploader';
import shuffleArray from '@/lib/shuffle';
import { FiPlusCircle } from 'react-icons/fi';
import useElements from '@/hooks/useElements';
import useDesigner from '@/hooks/useDesigner';
import useActionOpenDialog from '@/hooks/useActionOpenDialog';
import useActionSelectedElement from '@/hooks/useActionSelectedElement';
import useSelectedElement from '@/hooks/useSelectedElement';
import useActionDesigner from '@/hooks/useActionDesigner';
import { HiOutlineTrash } from 'react-icons/hi2';
import ImageGalleryIcon from '@/../public/images/home-page/gallery-tick.svg';
import { SwitchButton } from '../Switch/SwitchButton';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
// actions
import { createQuestionAction, updateQuestionAction } from '../../../actions/builder/question';

const questionType: ElementsType = 'MULTIPLE_CHOICE_IMAGE';

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
    title: '',
    score: 0,
    id: Math.random() * 100000,
  },
  {
    title: '',
    score: 0,
    id: Math.random() * 100000,
  },
];

const optionsSchema = z.object({
  title: z
    .string({
      invalid_type_error: 'عکس باید آپلود شود',
      message: 'عکس باید آپلود شود',
    })
    .min(8, { message: 'عکس باید آپلود شود' })
    .max(64, { message: 'عکس باید آپلود شود' }),
  score: z
    .number({
      message: 'اجباری',
      invalid_type_error: 'اجباری',
    })
    .nonnegative({ message: 'نمیتواند منفی باشد' })
    .min(0),
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
  optionList: z
    .array(optionsSchema, {
      message: 'حداقل باید 2 و حداکثر 10 گزینه وجود داشته باشد',
    })
    .min(2, { message: 'حداقل باید 2 و حداکثر 10 گزینه وجود داشته باشد' })
    .max(10, { message: 'حداقل باید 2 و حداکثر 10 گزینه وجود داشته باشد' }),
});

const DesignerComponent = memo(function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const labelText = element.title;
  const designerBtnLabel = MultipleChoiceImageFormElement.designerBtnElement.label;

  return (
     <div className="flex items-start flex-col overflow-hidden min-w-0 w-full max-w-[90%]" dir="rtl">
      <p dir="rtl" className="text-[13px] overflow-hidden text-ellipsis w-full line-clamp-1 text-[#161616] max-w-[calc(100%-75px)]">
        {labelText}
      </p>
      <p className="text-[11px] text-[#6F6F6F]">#{designerBtnLabel}</p>
    </div>
  );
});

export const MultipleChoiceImageFormElement: FormElement = {
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
    label: 'چند گزینه‌ای تصویری',
    icon: ImageGalleryIcon,
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

function FormComponent({ elementInstance, onChange, error, value }: { elementInstance?: FormElementInstance; onChange?: (value: string | string[]) => void; error?: string; value?: any }) {
  const element = elementInstance as CustomInstance;
  const isMultipleChoiceSelectionAllowed: boolean = element?.questionPropertyList?.find((el: any) => el?.questionPropertyEnum === 'MULTI_SELECT')?.value === 'true';
  const description = element?.questionPropertyList?.find((el) => el.questionPropertyEnum === 'DESCRIPTION')?.value;
  const randomOptions = element?.questionPropertyList?.find((el) => el?.questionPropertyEnum === 'RANDOMIZE_OPTIONS')?.value === 'true';

  const newOptionList = useMemo(() => (randomOptions ? shuffleArray(element?.optionList).slice() : element?.optionList.slice()), [element?.optionList, randomOptions]);

  const getInitialValue = useCallback(() => {
    if (!value) return isMultipleChoiceSelectionAllowed ? [] : '';
    if (Array.isArray(value)) {
      return value.map((v) => (typeof v === 'object' && 'optionId' in v ? String(v.optionId) : String(v)));
    }
    return typeof value === 'object' && 'optionId' in value ? String(value.optionId) : String(value);
  }, [value, isMultipleChoiceSelectionAllowed]);

  const [selectedValue, setSelectedValue] = useState<any>(getInitialValue());

  useEffect(() => {
    const newValue = getInitialValue();
    const areArraysEqual = Array.isArray(newValue) && Array.isArray(selectedValue) && JSON.stringify(newValue) === JSON.stringify(selectedValue);
    const areValuesEqual = !Array.isArray(newValue) && newValue === selectedValue;

    if (!areArraysEqual && !areValuesEqual) {
      setSelectedValue(newValue);
    }
  }, [value, getInitialValue, selectedValue]);

  const handleChange = useCallback(
    (event: any) => {
      const { value } = event.target;
      if (isMultipleChoiceSelectionAllowed) {
        setSelectedValue((prevSelected: any) => {
          const prev = prevSelected || [];
          let newSelection;
          if (prev.includes(value)) {
            newSelection = prev.filter((id: any) => id !== value);
          } else {
            newSelection = [...prev, value];
          }
          onChange?.(newSelection);
          return newSelection;
        });
      } else {
        onChange?.(value);
        setSelectedValue(value);
      }
    },
    [isMultipleChoiceSelectionAllowed, onChange],
  );

  return (
    <FormControl
      sx={{
        width: '100%',
        maxWidth: '1000px',
        textAlign: "justify"
      }}>
      <FormLabel
        sx={{
          marginBottom: '2rem',
          fontSize: { xs: 15, sm: 16 },
          '&.MuiFormLabel-root.MuiFormLabel-colorPrimary.Mui-focused': {
            color: '#353535',
          },
        }}
        id={String(element?.questionId)}>
        {element.title}
      </FormLabel>

      {isMultipleChoiceSelectionAllowed ? (
        <>
          <FormGroup
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: { xs: 1.5, sm: 3 },
              width: '100%',
              '& .MuiCheckbox-root': {
                display: 'none',
              },
            }}
          >
            {newOptionList?.map((option: any) => {
              const isSelected = selectedValue?.includes(String(option.id));

              return (
                <FormControlLabel
                  key={option?.id}
                  value={String(option?.id)}
                  onChange={handleChange}
                  control={<Checkbox checked={isSelected} />}
                  label={
                    <Box
                      sx={{
                        position: 'relative',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        padding: '6px',
                        border: '2px solid',
                        borderColor: isSelected ? '#1758BA' : 'rgba(0, 0, 0, 0.06)',
                        backgroundColor: isSelected ? 'rgba(23, 88, 186, 0.03)' : '#ffffff',
                        boxShadow: isSelected
                          ? '0 8px 20px rgba(23, 88, 186, 0.15)'
                          : '0 4px 12px rgba(0, 0, 0, 0.03)',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

                        '&:hover': {
                          transform: 'translateY(-1px)',
                          borderColor: isSelected ? '#1758BA' : 'rgba(23, 88, 186, 0.3)',
                          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          width: { xs: '100px', sm: '150px' },
                          height: { xs: '100px', sm: '150px' },
                          borderRadius: '12px',
                          overflow: 'hidden',
                        }}
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}/filemanager${option?.link}`}
                          alt={option?.title || 'option image'}
                          fill
                          sizes="(max-width: 600px) 100px, 150px"
                          priority
                          unoptimized
                          draggable={false}
                          style={{
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                          }}
                        />
                      </Box>
                    </Box>
                  }
                  sx={{
                    margin: 0,
                    '& .MuiFormControlLabel-label': {
                      width: '100%',
                    },
                  }}
                />
              );
            })}
          </FormGroup>

          {!!error && <Typography color='#f44336'>{error}</Typography>}
        </>
      ) : (
        <>
          <RadioGroup
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: { xs: 1.5, sm: 3 },
              width: '100%',
              '& .MuiRadio-root': {
                display: 'none',
              },
            }}
            onChange={handleChange}
            name={String(element?.questionId)}
          >
            {newOptionList?.map((option: any) => {
              const isSelected = selectedValue === String(option.id);

              return (
                <FormControlLabel
                  key={option?.id}
                  value={String(option?.id)}
                  control={<Radio checked={isSelected} />}
                  label={
                    <Box
                      sx={{
                        position: 'relative',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        padding: '6px',
                        border: '2px solid',
                        borderColor: isSelected ? '#1758BA' : 'rgba(0, 0, 0, 0.06)',
                        backgroundColor: isSelected ? 'rgba(23, 88, 186, 0.03)' : '#ffffff',
                        boxShadow: isSelected
                          ? '0 8px 20px rgba(23, 88, 186, 0.15)'
                          : '0 4px 12px rgba(0, 0, 0, 0.03)',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

                        '&:hover': {
                          transform: 'translateY(-1px)',
                          borderColor: isSelected ? '#1758BA' : 'rgba(23, 88, 186, 0.3)',
                          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
                          '& img': {
                            transform: 'scale(1.00)',
                          }
                        },
                      }}
                    >

                      <Box
                        sx={{
                          position: 'relative',
                          width: { xs: '100px', sm: '150px' },
                          height: { xs: '100px', sm: '150px' },
                          borderRadius: '12px',
                          overflow: 'hidden',
                        }}
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}/filemanager${option?.link}`}
                          alt={option?.title || 'option image'}
                          fill
                          sizes="(max-width: 600px) 100px, 150px"
                          priority
                          unoptimized
                          draggable={false}
                          style={{
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                          }}
                        />
                      </Box>
                    </Box>
                  }
                  sx={{
                    margin: 0,
                    '& .MuiFormControlLabel-label': {
                      width: '100%',
                    }
                  }}
                />
              );
            })}
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
  const elements = useElements();
  const setOpenDialog = useActionOpenDialog();
  const setSelectedElement = useActionSelectedElement();
  const selectedElement = useSelectedElement();
  const { updateElement, addElement } = useActionDesigner();
  const { questionGroups } = useDesigner();
  const element = elementInstance as CustomInstance;
  const [openDescriptionSwitch, setOpenDescriptionSwitch] = useState<boolean>(() =>
    element.questionPropertyList.some((property) => {
      return property.questionPropertyEnum === 'DESCRIPTION' && property.value;
    }),
  );
  const searchParams = useSearchParams();
  const search = searchParams.get('admin');
  const isSurvey = search === 'survey' || search === 'survey-new' || search === 'data-collection' || search === 'data-collection-new';
  const defaultValues = useMemo(() => {
    const matchingElement = elements?.find((el: any) => el?.questionId === element?.questionId);
    const optionListCopy = matchingElement ? [...element.optionList] : [];

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
    values.optionList = matchingElement
      ? optionListCopy.map((optionItem) => {
        delete optionItem?.position;
        delete optionItem?.isTarget;
        return optionItem;
      })
      : [];
    return values;
  }, [element, elements]);

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onBlur',
    defaultValues,
  });

  const {
    control,
    setValue,
    getValues,
    register,
    reset,
    handleSubmit,
    clearErrors,
    formState: { isSubmitting, errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'optionList',
  });

  const handleUppyUpload = useCallback(
    (index: number, data: string[]) => {
      setValue(`optionList.${index}.title`, data[0]);
      clearErrors(`optionList.${index}.title`);
    },
    [setValue, clearErrors],
  );

  const handleScoreChange = useCallback(
    (index: number, data: number) => {
      setValue(`optionList.${index}.score`, data);
    },
    [setValue],
  );

  const handleAddOption = useCallback(() => {
    if (fields.length >= 10) return;
    const random = Math.ceil(Math.random() * 100000);

    append({ id: random, title: '', score: 0 } as any);
    if (fields.length === 1) {
      clearErrors('optionList');
    }
  }, [append, clearErrors, fields.length]);

  async function onSubmit(values: propertiesFormSchemaType) {
    const { title, label, DESCRIPTION, REQUIRED, RANDOMIZE_OPTIONS, MULTI_SELECT, optionList, EDIT_ANSWER_LOCKED } = values;

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

    const newOptionList = optionList.map((upload: any) => {
      return {
        score: upload.score,
        title: upload.title,
      };
    });

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
      optionList: newOptionList,
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
        const res = await updateQuestionAction(String(finalFieldData.questionId), finalFieldData);
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
        <Box>
          <Box marginTop={3}>
            {fields.map((field: any, index: number) => (
              <Box key={field.id} display='flex' alignItems='flex-start' border='1px dashed #1758BA' borderRadius='10px' justifyContent='space-between' my={1.5} p={0.75}>
                {field?.link?.includes('/download/') ? (
                  <Image
                    width={128}
                    height={128}
                    draggable={false}
                    loading={'eager'}
                    alt=''
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '12px',
                    }}
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}/filemanager${field?.link}`}
                  />
                ) : (
                  <div>
                    <UppyUploader sx={{}} register={register(`optionList.${index}.title`)} getData={(data: string[]) => handleUppyUpload(index, data)} />
                    <p className='text-[#D21425] text-[12px]'>{errors?.optionList && errors?.optionList[index]?.title?.message}</p>
                  </div>
                )}
                <Box display='flex' flexDirection='column' alignItems='center' gap={2}>
                  <RHFTextField
                    name={`optionList.${index}.score`}
                    callBack={(data: number) => handleScoreChange(index, data)}
                    getRHF={getValues}
                    uploader={true}
                    type='number'
                    sx={{
                      width: '50px',
                      '& .MuiInputBase-input': {
                        textAlign: 'center',
                        padding: '5px !important',
                      },
                      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        display: 'none',
                      },
                      '& input[type=number]': {
                        MozAppearance: 'textfield',
                      },
                    }}
                  />
                  <IconButton
                    aria-label='trash'
                    onClick={() => remove(index)}
                    sx={{
                      marginBottom: 0,
                      borderRadius: '10px',
                      border: '1px solid transparent',
                      borderColor: '#FA4D56',
                      color: '#FA4D56',
                    }}>
                    <HiOutlineTrash size='1.5rem' color='#FA4D56' />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
          <Box display='flex' alignItems='center' justifyContent='space-between' width='100%'>
            <p className='text-[#D21425] text-[12px] ml-2'>{errors?.optionList?.message}</p>
            <p className='text-[#D21425] text-[12px] ml-2'>{errors?.optionList?.root?.message}</p>
            <IconButton
              disabled={fields.length >= 10}
              onClick={handleAddOption}
              sx={{
                marginBottom: 0,
                borderRadius: '10px',
                border: '1px solid transparent',
                borderColor: '#1758BA',
                color: '#1758BA',
              }}>
              <FiPlusCircle size='1.5rem' color='#1758BA' />
            </IconButton>
          </Box>
        </Box>
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
