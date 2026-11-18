'use client';

import { z } from 'zod';
import { memo } from 'react';
import { toast } from 'sonner';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Autocomplete, Box, CircularProgress, MenuItem, Skeleton, TextField } from '@mui/material';
import Image from 'next/image';
// components
import FormProvider from '@/components/hook-form/FormProvider';
import { FIELD_PROPERTIES_FORM_ID } from '@/constants/fieldDialog';
// hooks
import useDesigner from '@/hooks/useDesigner';
import useElements from '@/hooks/useElements';
import useActionDesigner from '@/hooks/useActionDesigner';
import useActionElements from '@/hooks/useActionElements';
import useSelectedElement from '@/hooks/useSelectedElement';
import useActionOpenDialog from '@/hooks/useActionOpenDialog';
import { useGetPackagingFormsCombo } from '@/templates/packaging/hooks/useGetPackagingFormsCombo';
// images
import Packaging from '@/../public/images/home-page/packaging.svg';
import { useGetForm } from '@/app/(builder)/builder/_hook/useGetForm';
import { IFormElementConstructor, IQPLPackagingForm } from '@/types/bulider';
import type { ElementsType, FormElement, FormElementInstance } from '@/types/formElementTypes';
import FieldDialogActionBottomButtons from '../FieldDialogActionBottomButtons/FieldDialogActionBottomButtons';
import {
  createPackagingInjection,
  type PackagingInjectionBody,
} from '@/lib/builderFieldActions';

interface IGetPAckagingForm {
  value: string;
  caption: string;
}
const questionType: ElementsType = 'PACKAGE_INJECTION_FIELD';

const questionPropertyList: IQPLPackagingForm = [
  {
    id: 1,
    questionPropertyEnum: 'PACKAGING_FORM',
    value: 'false',
  }
];

const propertiesSchema = z.object({
  selectedFormId: z.string().min(1, { message: 'لطفا یک فرم را انتخاب کنید' }),
});

const DesignerComponent = memo(function DesignerComponent() {
  return <></>
});
// ------------------------------------------------------------------------
export const PackageInjectionFormElement: FormElement = {
  questionType,
  construct: ({ questionId, questionGroupId, formId, title, position }: IFormElementConstructor) => ({
    questionId,
    questionGroupId,
    formId,
    title,
    questionType,
    position,
    questionPropertyList: questionPropertyList
  }),
  designerBtnElement: {
    label: 'فرم‌ها',
    icon: Packaging,
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

function FormComponent() {
  return <></>
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
// ------------------------------------------------------------------------
function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const elements = useElements();
  const queryClient = useQueryClient()
  const setElements = useActionElements();
  const { questionGroups } = useDesigner();
  const setOpenDialog = useActionOpenDialog();
  const selectedElement = useSelectedElement();
  const { refetch } = useGetForm(element.formId);
  const { setQuestionGroups } = useActionDesigner();
  const { FormsList, isFetchingForms } = useGetPackagingFormsCombo();

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onSubmit',
    defaultValues: {
      selectedFormId: ''
    }
  });

  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const selectedFormId = watch('selectedFormId');
  const selectedForm = FormsList?.find((item: IGetPAckagingForm) => item.value === selectedFormId);

  async function onSubmit(values: propertiesFormSchemaType) {
    const group = elements.filter((el: any) => el.questionGroupId === selectedElement?.fieldElement?.questionGroupId);
    let findSelectedGroupPreviousGroup = questionGroups.findIndex((el: any) => el === selectedElement?.fieldElement?.questionGroupId) - 1;

    if (findSelectedGroupPreviousGroup === -1) {
      findSelectedGroupPreviousGroup = 0;
    }

    const body: PackagingInjectionBody = {
      targetFormId: Number(element.formId),
      selectedFormId: Number(values.selectedFormId),
      position: selectedElement?.position?.apiPosition ?? group.length,
    };

    try {
      const res = await createPackagingInjection(body);

      if (!res.success) {
        toast.error(res.message || 'انجام عملیات با خطا مواجه شد');
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["form-builder", element.formId] })
      const newComeingData = await refetch()

      const questionGroupIds =
        newComeingData.data?.questionGroups?.map((g: any) => g.questionGroupId) || [];
      setQuestionGroups(questionGroupIds);

      const allQuestions =
        newComeingData.data?.questionGroups?.flatMap((g: any) => g.questions) || [];

      const cleanedQuestions = allQuestions.map((q: FormElementInstance) => {
        const { questionPropertyList, optionList, spectralPlaceList, ...rest } = q;
        return rest;
      });

      setElements(cleanedQuestions);

      setOpenDialog(false);
      reset();
    } catch (error: any) {
      toast.error(error?.message || 'انجام عملیات با خطا مواجه شد');
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} formId={FIELD_PROPERTIES_FORM_ID}>
      <div dir="rtl" className="flex flex-col w-full gap-4 px-2.5">
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-bold text-[#161616]">انتخاب فرم</p>
          <Controller
            name="selectedFormId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                options={FormsList ?? []}
                loading={isFetchingForms}
                disabled={isFetchingForms}
                openOnFocus={!isFetchingForms}
                getOptionLabel={(option) => option.caption}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                value={FormsList?.find((item: IGetPAckagingForm) => item.value === field.value) ?? null}
                onChange={(_, option) => field.onChange(option?.value ?? '')}
                noOptionsText="فرمی یافت نشد"
                loadingText="در حال بارگذاری فرم‌ها..."
                slotProps={{
                  paper: {
                    sx: { direction: 'rtl', borderRadius: '12px' },
                  },
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    <span className="text-[14px] leading-6 whitespace-normal break-words">{option.caption}</span>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={isFetchingForms ? 'در حال بارگذاری فرم‌ها...' : 'جستجو یا انتخاب فرم'}
                    error={!!error}
                    helperText={error?.message}
                    sx={{
                      '& .MuiInputBase-root': {
                        bgcolor: '#fff',
                        borderRadius: '10px',
                        minHeight: 52,
                      },
                    }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isFetchingForms ? <CircularProgress color="inherit" size={18} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            )}
          />
        </div>

        {selectedForm ? (
          <div className="flex items-center gap-3 rounded-xl border border-[#DDE1E6] bg-[#F8FAFC] px-3 py-3">
            <Image src={Packaging} alt="" width={28} height={28} />
            <div className="min-w-0">
              <p className="text-[12px] text-[#6B7280]">فرم انتخاب‌شده</p>
              <p className="text-[14px] font-medium text-[#161616] break-words">{selectedForm.caption}</p>
            </div>
          </div>
        ) : (
          <p className="text-[13px] text-[#6B7280]">یک فرم را انتخاب کنید.</p>
        )}
      </div>
      <FieldDialogActionBottomButtons status={isSubmitting} />
    </FormProvider>
  );
}
// ------------------------------------------------------- loading
export const SkeletonMenuItem = () => (
  <MenuItem
    disabled
    sx={{
      borderRadius: '12px',
      mx: 1,
      my: 0.5,
      px: 2,
      py: 1.2,
      display: 'flex',
      alignItems: 'flex-start',
      cursor: 'default',
      '&:hover': {
        bgcolor: 'transparent',
      }
    }}
  >
    <Box display="flex" flexDirection="column" sx={{ minWidth: 0, width: '100%' }}>
      <Skeleton
        variant="text"
        width="80%"
        height={20}
        sx={{ borderRadius: '4px' }}
      />
      <Skeleton
        variant="text"
        width="60%"
        height={16}
        sx={{ mt: 0.5, borderRadius: '4px' }}
      />
    </Box>
  </MenuItem>
);