'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { memo, useEffect, useState } from 'react';
import { ElementsType, FormElement, FormElementInstance } from '@/types/FormElements';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, MenuItem, Typography } from '@mui/material';
import FormProvider from '@/components/hook-form/FormProvider';
import { RHFSelect } from '../../components/hook-form';
import useDesigner from '@/hooks/useDesigner';
import useElements from '@/hooks/useElements';
import { useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import useActionDesigner from '@/hooks/useActionDesigner';
import useSelectedElement from '@/hooks/useSelectedElement';
import useActionOpenDialog from '@/hooks/useActionOpenDialog';
import TickIcon from '@/../public/images/home-page/tick-square.svg';
import useActionSelectedElement from '@/hooks/useActionSelectedElement';
import { IFormElementConstructor, IQPLPackagingForm } from '@/types/bulider';
import FieldDialogActionBottomButtons from '../FieldDialogActionBottomButtons/FieldDialogActionBottomButtons';
// actions
import PreviewLoading from '@/app/(builder)/preview/[id]/loading';
import { createPackagingFormInjection, IPostPackageFormInjectionBody, updateQuestionAction } from '../../../actions/builder/question';
import { useGetPackagingFormsCombo } from '@/templates/packaging/hooks/useGetPackagingFormsCombo';

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

const DesignerComponent = memo(function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const labelText = element.title;
  const designerBtnLabel = PackageInjectionFormElement.designerBtnElement.label;

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
    label: 'فرم ها',
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
};

function FormComponent() {
  return <></>
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const elements = useElements();
  const queryClient = useQueryClient()
    const setOpenDialog = useActionOpenDialog();
  const { questionGroups } = useDesigner(); 
  const { FormsList, isFetchingForms } = useGetPackagingFormsCombo();

  const selectedElement = useSelectedElement();

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onSubmit',
    defaultValues : {
      selectedFormId : ''
    }
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  async function onSubmit(values: propertiesFormSchemaType) {
    const group = elements.filter((el: any) => el.questionGroupId === selectedElement?.fieldElement?.questionGroupId);

    let findSelectedGroupPreviousGroup = questionGroups.findIndex((el: any) => el === selectedElement?.fieldElement?.questionGroupId) - 1;

    if (findSelectedGroupPreviousGroup === -1) {
      findSelectedGroupPreviousGroup = 0;
    }

    const body : IPostPackageFormInjectionBody = {
      targetFormId : Number(element.formId),
      selectedFormId : Number(values.selectedFormId),
      position: selectedElement?.position?.apiPosition ?? group.length,
    }; 

      try {
        const data = await createPackagingFormInjection(body);
        queryClient.invalidateQueries({ queryKey: ["form-builder", element.formId]})
             setOpenDialog(false);
        reset();
      } catch (error: any) {
        toast.error(error?.message || 'انجام عملیات با خطا مواجه شد');
      }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          paddingX: 0,
          direction: 'ltr',
          width: '100%',
        }}>

        <Box display='flex' flexDirection='column' gap='8px' width='100%' paddingX={2.5}>
          <Typography variant='subtitle2' fontWeight='700'>
            انتخاب فرم:
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              direction: 'ltr',
              width: '100%',
              '& .MuiFormControl-root, & .MuiInputBase-root': {
                borderRadius: '10px',
              },
            }}>
            <RHFSelect
              fullWidth
              name='selectedFormId'
              sx={{
                '& .MuiInputBase-root': {
                  bgcolor: '#fff',
                  width: "100%"
                },
              }}
              >
              {isFetchingForms && <MenuItem value=''><PreviewLoading /></MenuItem>}
              {FormsList?.map((item: IGetPAckagingForm) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.caption}
                </MenuItem>
              ))}
            </RHFSelect>
          </Box>
        </Box>
        <FieldDialogActionBottomButtons status={isSubmitting} />
      </Box>
    </FormProvider>
  );
}
