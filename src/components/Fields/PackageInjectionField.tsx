'use client';

import { z } from 'zod';
import { memo } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Box, MenuItem, Skeleton, Typography } from '@mui/material';
// components
import { RHFSelect } from '../../components/hook-form';
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
import { ElementsType, FormElement, FormElementInstance } from '@/types/FormElements';
import FieldDialogActionBottomButtons from '../FieldDialogActionBottomButtons/FieldDialogActionBottomButtons';
// actions
import { createPackagingFormInjection, IPostPackageFormInjectionBody } from '../../../actions/builder/question';

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
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  async function onSubmit(values: propertiesFormSchemaType) {
    const group = elements.filter((el: any) => el.questionGroupId === selectedElement?.fieldElement?.questionGroupId);
    let findSelectedGroupPreviousGroup = questionGroups.findIndex((el: any) => el === selectedElement?.fieldElement?.questionGroupId) - 1;

    if (findSelectedGroupPreviousGroup === -1) {
      findSelectedGroupPreviousGroup = 0;
    }

    const body: IPostPackageFormInjectionBody = {
      targetFormId: Number(element.formId),
      selectedFormId: Number(values.selectedFormId),
      position: selectedElement?.position?.apiPosition ?? group.length,
    };

    try {
      const res = await createPackagingFormInjection(body);

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
              width: '100%',
              overflow: 'hidden',
              boxSizing: 'border-box',
              '& .MuiFormControl-root, & .MuiInputBase-root': {
                borderRadius: '10px',
                width: '100%',
              },
            }}
          >
            <RHFSelect
              fullWidth
              name="selectedFormId"
              sx={{
                '& .MuiInputBase-root': { bgcolor: '#fff' },
              }}
            >
              {isFetchingForms ? (
                <>
                  <SkeletonMenuItem />
                  <SkeletonMenuItem />
                </>
              ) : (
                FormsList?.map((item: IGetPAckagingForm) => (
                  <MenuItem
                    key={item.value}
                    value={item.value}
                    sx={{
                      borderRadius: '12px',
                      mx: 1,
                      my: 0.6,
                      px: 2,
                      py: 1.5,
                      display: 'flex',
                      transition: 'all 0.2s ease-in-out',
                      flex: 1,
                      '&:hover': {
                        bgcolor: '#F3F6FD',
                        color: '#1976d2',
                      },
                      '&.Mui-selected': {
                        bgcolor: '#E8F0FF !important',
                        color: '#1565c0',
                        fontWeight: 600,
                      },
                    }}
                  >

                    <Box sx={{
                      minWidth: 0,
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <Typography
                        fontSize={14}
                        fontWeight={500}
                        lineHeight={1.4}
                        sx={{
                          maxWidth: 300,
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                        }}
                      >
                        {item.caption}
                      </Typography>
                    </Box>
                  </MenuItem>
                )))}
            </RHFSelect>

          </Box>
        </Box>
        <FieldDialogActionBottomButtons status={isSubmitting} />
      </Box>
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