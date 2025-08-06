'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FormProvider from '../../components/hook-form/FormProvider';
import RHFTextField from '../../components/hook-form/RHFTextField';
import { IFormElementConstructor } from '@/types/bulider';
import FieldDialogActionBottomButtons from '../FieldDialogActionBottomButtons/FieldDialogActionBottomButtons';
import { ElementsType, FormElement, FormElementInstance } from '@/types/FormElements';
import { useParams } from 'next/navigation';
import useDesigner from '@/hooks/useDesigner';
import { AxiosApi } from '@/services/axios/AxiosApi';
import useActionOpenDialog from '@/hooks/useActionOpenDialog';
import useActionSelectedElement from '@/hooks/useActionSelectedElement';
import useSelectedElement from '@/hooks/useSelectedElement';
import useActionDesigner from '@/hooks/useActionDesigner';
import { toast } from 'sonner';
import { memo } from 'react';

const questionType: ElementsType = 'TitleFieldStart';

const propertiesSchema = z.object({
  startPageMsg: z
    .string({ message: 'حداقل باید 1 و حداکثر 250 کاراکتر باشد' })
    .trim()
    .transform((value) => value.replace(/\s+/g, ' '))
    .pipe(
      z.string({ message: 'حداقل باید 1 و حداکثر 250 کاراکتر باشد' }).min(1, { message: 'حداقل باید 1 و حداکثر 250 کاراکتر باشد' }).max(250, { message: 'حداقل باید 1 و حداکثر 250 کاراکتر باشد' }),
    ),
});

const DesignerComponent = memo(function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { label } = TitleFieldStartFormElement.designerBtnElement;
  const startPageMsg = elementInstance?.startPageMsg;

  return (
    <div
      className='flex items-start flex-col overflow-hidden absolute'
      dir='rtl'
      style={{
        width: 'calc(100% - 56px)',
      }}>
      <p dir='rtl' className='text-base overflow-hidden text-ellipsis w-full' style={{ textWrap: 'nowrap', fontWeight: '700' }}>
        {startPageMsg}
      </p>
      <p className='text-xs'>#{label}</p>
    </div>
  );
});

export const TitleFieldStartFormElement: FormElement = {
  questionType,
  construct: ({ questionId, startPageMsg }: IFormElementConstructor) => ({
    questionId,
    startPageMsg,
    questionType,
  }),
  designerBtnElement: {
    label: 'صفحه شروع',
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => true,
};

function FormComponent({ elementInstance }: { elementInstance?: FormElementInstance }) {
  return <p className='text-xl'></p>;
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const { id } = useParams();
  const element = elementInstance;
  const setOpenDialog = useActionOpenDialog();
  const setSelectedElement = useActionSelectedElement();
  const selectedElement = useSelectedElement();
  const { updateStartPage, addStartPage } = useActionDesigner();
  const { startPage } = useDesigner();

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onSubmit',
    defaultValues: {
      startPageMsg: element.startPageMsg,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  async function applyChanges(values: propertiesFormSchemaType) {
    const { startPageMsg } = values;

    const data = {
      formId: id,
      startPageMsg: startPageMsg,
    };

    if (!startPage) {
      try {
        const res = await AxiosApi.put('/form/start-page', data as any);
        addStartPage({
          ...selectedElement?.fieldElement,
          startPageMsg: res.data.startPageMsg,
        } as FormElementInstance);
        toast.success('صفحه شروع با موفقیت افزوده شد');
        setOpenDialog(false);
        setSelectedElement(null);
        reset();
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const res = await AxiosApi.put('/form/start-page', data as any);
        updateStartPage({
          ...element,
          startPageMsg: res.data.startPageMsg,
        });
        setOpenDialog(false);
        setSelectedElement(null);
        reset();
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(applyChanges)}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          direction: 'ltr',
          width: '100%',
          paddingX: 1.5,
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            direction: 'ltr',
            width: '100%',
            paddingX: 1.5,
            '& .MuiFormControl-root, & .MuiInputBase-root': {
              borderRadius: '10px',
            },
          }}>
          <RHFTextField multiline rows={5} name='startPageMsg' />
        </Box>
        <FieldDialogActionBottomButtons status={isSubmitting} />
      </Box>
    </FormProvider>
  );
}
