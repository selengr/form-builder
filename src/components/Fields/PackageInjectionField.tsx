'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { memo, useEffect, useMemo, useState } from 'react';
import { ElementsType, FormElement, FormElementInstance } from '@/types/FormElements';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import FormProvider from '@/components/hook-form/FormProvider';
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
// test
const questionType: ElementsType = 'TEXT_FIELD';

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



const propertiesSchema = z.object({
  selectedFormId: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, ' '))
    .pipe(z.string().min(1, { message: 'حداقل باید 1 و حداکثر 4000 کاراکتر باشد' }).max(3999, { message: 'حداقل باید 1 و حداکثر 4000 کاراکتر باشد' })),
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
    label: 'تزریق فرم',
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
    const { selectedFormId } = values;

    // ? finds whether a field is selected or not
    const selectedYet = elements?.find((el: any) => el?.questionId === element?.questionId);


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
      position: selectedElement?.position?.apiPosition ?? group.length,
  
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
      } catch (error:any) {
         toast.error( error?.message || 'انجام عملیات با خطا مواجه شد');
      }
    } else {
      try {
        const { data }: any = await updateQuestionAction(String(finalFieldData?.questionId), finalFieldData);
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
      } catch (error:any) {
         toast.error( error?.message || 'انجام عملیات با خطا مواجه شد');
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
          <RHFTextFieldOptionList name='optionList' errorMessage={""} />
        </Stack>

        <FieldDialogActionBottomButtons status={isSubmitting} />
      </Box>
    </FormProvider>
  );
}
