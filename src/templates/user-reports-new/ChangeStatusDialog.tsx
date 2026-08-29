'use client';
// React & Libs
import * as z from 'zod';
import { CgClose } from 'react-icons/cg';
import { FormProvider, useForm } from 'react-hook-form';
import { IconButton } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
// hooks
import { usePostChangeStatus } from './hooks/usePostChangeStatus';
// components
import { RHFTextField } from '@/components/hook-form';
import { SubmitButtons } from '@/components/condition/form/SubmitButtons';
// style
import { StyledDialog, StyledDialogContent } from './userReports.style';
import { useQueryClient } from '@tanstack/react-query';

export interface IProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  publicationApprovalByAdmin: boolean;
  setPublicationApprovalByAdmin: Dispatch<SetStateAction<boolean>>;
}

const TicketSchema = z.object({
  ticket: z.string().min(1, { message: 'اين فيلد الزامي است' }),
});
type TTicketFormData = z.infer<typeof TicketSchema>;

export const ChangeStatusDialog: React.FC<IProps> = ({ open, setOpen, publicationApprovalByAdmin, setPublicationApprovalByAdmin }) => {
  const { id } = useParams();
  const postChangeStatus = usePostChangeStatus();

  const queryClient = useQueryClient();

  const methods = useForm<TTicketFormData>({
    resolver: zodResolver(TicketSchema),
    defaultValues: {
      ticket: '',
    },
  });

  const handleClose = () => {
    setOpen((prev) => !prev);
  };

  const onSubmit = ({ ticket }: { ticket: string }) => {
    postChangeStatus.mutate(
      {
        data: {
          ticket,
          formId: id as string | string[],
          publicationApprovalByAdmin: !publicationApprovalByAdmin,
        },
      },
      {
        onSuccess: async() => {
          queryClient.invalidateQueries({ queryKey: ['datas'] });
          setPublicationApprovalByAdmin(!publicationApprovalByAdmin)
          handleClose();
        },
      },
    );
  };

  return (
    <StyledDialog open={open} maxWidth='xl'>
      <StyledDialogContent>
        <div className='flex items-center justify-end h-6 -ml-2'>
          <IconButton edge='end'>
            <CgClose color='#404040' width={25} height={20} size='1.5rem' onClick={() => handleClose()} />
          </IconButton>
        </div>
        <label className='flex justify-center text-[15px] text-[#404040] mb-8 font-bold'>شرح عملیات</label>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <RHFTextField
              multiline
              rows={6}
              name='ticket'
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '10px',
                },
              }}
            />
            <SubmitButtons isLoading={postChangeStatus.isPending} handleClose={handleClose} />
          </form>
        </FormProvider>
      </StyledDialogContent>
    </StyledDialog>
  );
};

export default ChangeStatusDialog;
