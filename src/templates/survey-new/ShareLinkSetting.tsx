'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoShareSocialSharp } from 'react-icons/io5';
import { LuCopy, LuRefreshCcw } from 'react-icons/lu';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Typography } from '@mui/material';
import FormProvider, { RHFCheckBox, RHFTextField } from '@/components/hook-form';

// components
import Share from '@/components/share-media/Share';
import ConfirmDialog from '@/components/confirm-dialog';
import { SwitchButton } from '@/components/Switch/SwitchButton';
import CopyToClipboardButton from '@/components/clipboard-button/CopyToClipBoardButton';


const buttonStylesAlert = {
  height: '50px',
  fontWeight: '400',
  fontSize: '15px',
  borderRadius: '10px',
  boxShadow: 'none',
  transition: 'background-color 0.3s, border-color 0.3s',
  bgcolor: '#1758BA',
  borderColor: '#1758BA',
  '&:hover': {
    bgcolor: '#0F4C8A',
  },
  '&:active': {
    bgcolor: '#0A3A6A',
  },
};

const DEFAULT_LINK = `${process.env.NEXT_PUBLIC_MBZ_DOMAIN}form`;
const propertiesSchema = z.object({
  link: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, ' '))
    .pipe(z.string()),
  publicationMainPageMethod: z.boolean(),
  showReportForResponder: z.boolean(),
});

type PropertiesFormSchemaType = z.infer<typeof propertiesSchema>;

interface ShareLinkSettingProps {
  handleOpen: () => void;
  formData: {
    formId: string | number;
    publicLink: string;
    formPublishSetting: {
      publicationMainPageMethod: boolean
      privateLink : string
    },
    isCreatedSoloReport: boolean | null
    showReportForResponder: boolean | null
  };
}

const IconButtonContainer = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      padding: { xs: '8px', sm: '8px 15px' },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #1758BA',
      borderRadius: '10px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgba(23, 88, 186, 0.08)',
      },
    }}>
    {children}
  </Box>
);

export default function ShareLinkSetting({ handleOpen, formData }: ShareLinkSettingProps) {
  const { push } = useRouter()
  const FINAL_LINK = `${DEFAULT_LINK}/${formData?.formPublishSetting?.privateLink}`;
  const [isShowReportForResponder, setIsShowReportForResponder] = useState<boolean>(formData?.showReportForResponder || false);
  const [openShowReportForResponderDialog, setOpenShowReportForResponderDialog] = useState<boolean>(false);

  const methods = useForm<PropertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'all',
    defaultValues: {
      link: FINAL_LINK,
      publicationMainPageMethod: formData?.formPublishSetting?.publicationMainPageMethod || false,
      showReportForResponder: formData?.showReportForResponder || false,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty }
  } = methods;

  const onSubmit = () => {}

  const handleCancel = useCallback(() => {
    handleOpen();
    reset();
  }, [handleOpen, reset]);

  const handleShowReportForResponder = () => {
    // if (formData.isCreatedSoloReport) {
    //   const currentValue = getValues("showReportForResponder");
    //   setValue("showReportForResponder", !currentValue, { shouldDirty: false });
    //   setIsShowReportForResponder((prev) => !prev)
    // } else {
    //   setOpenShowReportForResponderDialog(true)
    // }
  }

  const toggleConfirm = () => {
    setOpenShowReportForResponderDialog((prev) => !prev)
  }

  const handleRedirection = () => {
    push("/reports")
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
          gap: 1,
        }}>
        <Box display='flex' gap={1} mt={4}>
          <IconButtonContainer>
            <LuRefreshCcw size='1.5rem' color='#1758BA' />
          </IconButtonContainer>

          <RHFTextField
            name='link'
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: '10px',
                fontWeight: '600',
              },
            }}
          />

            <CopyToClipboardButton link={FINAL_LINK} icon={<LuCopy size='1.5rem' color='#1758BA' />} />
  
          <IconButtonContainer>
            <Share
              shareData={{
                title: 'لینک سایا',
                text: 'لینک سایا',
                url: FINAL_LINK,
              }}>
              <IoShareSocialSharp size='1.5rem' color='#1758BA' />
            </Share>
          </IconButtonContainer>
        </Box>


        <Box display='flex' flexDirection='column' gap={2} mt={2}>

          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='subtitle2' fontWeight={500} fontSize='14px'>
              نمایش نتیجه به پاسخ دهنده
            </Typography>
            <SwitchButton
              onChange={handleShowReportForResponder}
              checked={isShowReportForResponder}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '10px',
                  fontWeight: 600,
                  height: 42,
                },
              }}
            />
          </Box>

        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          px: 2,
          width: '100%',
          mt: 3,
          marginBottom: '16px',
        }}>
        <Button
          type='submit'
          fullWidth
          variant='contained'
          disabled={isSubmitting}
          loading={isSubmitting}
          sx={{
            bgcolor: 'primary.main',
            height: 54,
            color: 'white',
            fontSize: { xs: '13px', sm: '16px' },
            fontWeight: 700,
            borderRadius: '10px',
            boxShadow: 'none',
            '&:hover, &:active': {
              bgcolor: 'primary.dark',
              boxShadow: 'none',
            },
          }}>
              اعمال تغییرات
        </Button>

        <Button
          disabled={isSubmitting}
          type='button'
          fullWidth
          variant='outlined'
          onClick={handleCancel}
          sx={{
            height: 54,
            fontWeight: 700,
            borderRadius: '10px',
            fontSize: { xs: '13px', sm: '16px' },
            color: 'primary.main',
            borderColor: 'primary.main',
            '&:hover': {
              bgcolor: 'action.hover',
              borderColor: 'primary.main',
            },
          }}>
          انصراف
        </Button>
      </Box>

      <ConfirmDialog
        content='تا زمانی که قالب گزارش انفرادی نساخته باشید نمیتواند این تیک را بزند '
        open={openShowReportForResponderDialog}
        title='اخطار'
        onClose={toggleConfirm}
        cancelText='انصراف'
        action={
          <Button type='submit' fullWidth disableRipple variant='contained'
            sx={{ ...buttonStylesAlert }}
            onClick={handleRedirection}
          >
            برو به قالب گزارش
          </Button>
        }
      />
    </FormProvider>
  );
}
