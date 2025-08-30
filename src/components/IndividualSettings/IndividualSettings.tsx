'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FormProvider, { RHFMultiSelect, RHFSelect, RHFSwitch, RHFTextField } from '../hook-form';
import { Box, Button, MenuItem, Typography } from '@mui/material';
import { toast } from 'sonner';
import { getAuthToken } from '@/utils/getAuthToken';
// components
import { SwitchButton } from '../Switch/SwitchButton';
import ConfirmDialog from '@/components/confirm-dialog';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

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

interface GroupComboItem {
  value: string;
  caption: string
}

interface IndividualSettingsProps {
  handleOpen: () => void;
  formId: string | number;
  formData: {
    isCreatedSoloReport: boolean | null
    showReportForResponder: boolean | null
  };
}

const textFieldCommonSx = {
  '& .MuiInputBase-root': {
    bgcolor: '#fff',
    borderRadius: '10px',
    paddingY: '0',
  },
};

const inputFieldContainerSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
  paddingX: 0.5,
};

const nameSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/\s+/g, ' '))
  .pipe(z.string().min(2, { message: 'حداقل باید 2 و حداکثر 50 کاراکتر باشد' }).max(50, { message: 'حداقل باید 2 و حداکثر 50 کاراکتر باشد' }));

const propertiesSchema = z.object({
  name: nameSchema,
  family: nameSchema,
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, ''))
    .pipe(
      z.string().regex(/^09\d{9}$/, {
        message: 'شماره تلفن باید با 09 شروع شود و دقیقاً 11 رقم داشته باشد',
      }),
    ),
  gender: z.enum(['MALE', 'FEMALE'], {
    message: 'جنسیت الزامی است و باید male یا female باشد',
  }),
  group: z.string().optional(),
  show: z.boolean().default(false).optional(),
  showReportForResponder: z.boolean(),
});

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

const IndividualSettings: React.FC<IndividualSettingsProps> = ({ handleOpen, formId, formData }) => {
  const { push } = useRouter()
  const [groupOptions, setGroupOptions] = useState<GroupComboItem[]>([]);
  const [isShowReportForResponder, setIsShowReportForResponder] = useState<boolean>(false);
  const [openShowReportForResponderDialog, setOpenShowReportForResponderDialog] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      family: '',
      phone: '',
      gender: undefined,
      group: '',
      show: false,
      showReportForResponder: formData?.showReportForResponder || false,
    },
  });

  const {
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { isSubmitting, isValid },
    setError,
  } = methods;

  useEffect(() => {
    async function fetchGroups() {
      try {
        const params = {
          type: 'COMBO',
          entity: 'QUESTIONS',
          mode: 'QUESTIONS_IN_FORM_BUILDER__ALL',
          input: '',
          page: 0,
          rows: 10000,
        };

        const search = new URLSearchParams({
          customComboFilterModel: JSON.stringify(params),
        });
        const token = await getAuthToken();

        const response = await fetch(`/api/group/combo?${search.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setGroupOptions(data.dataList);
        } else {
          toast.error(data.error || 'خطا در دریافت گروه‌ها');
        }
      } catch (err) {
        toast.error('ارتباط با سرور برقرار نشد');
      }
    }

    fetchGroups();
  }, []);

  async function onSubmit(values: propertiesFormSchemaType) {
    const token = await getAuthToken();

    try {
      const response = await fetch('/api/publish/individual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          formId: formId.toString(),
          name: values.name,
          lname: values.family,
          username: values.phone,
          gender: values.gender,
          groupId: values.group || null,
          showReportForResponder: values.showReportForResponder,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error && data.details) {
          data.details.forEach((err: any) => {
            if (err.path && err.path[0]) {
              setError(err.path[0], {
                type: 'manual',
                message: err.message || 'خطا در ورودی',
              });
            }
          });
        } else if (data.error) {
          toast.error(data.error);
        } else {
          toast.error('خطای ناشناخته از سمت سرور');
        }
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['datas_builder_query'] });
      toast.success('با موفقیت به سبد خرید افزوده شد.');
      handleOpen();
      reset();
    } catch (error) {
      toast.error('خطا در برقراری ارتباط با سرور.');
    }
  }

  const handleShowReportForResponder = () => {
    if (formData?.isCreatedSoloReport) {
      const currentValue = getValues("showReportForResponder");
      setValue("showReportForResponder", !currentValue, { shouldDirty: false });
      setIsShowReportForResponder((prev) => !prev)
    } else {
      setOpenShowReportForResponderDialog(true)
    }
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
          width: '100%',
          bgcolor: '#F7F7FF',
          borderRadius: '8px',
          padding: 2,
          marginY: 2,
          gap: 1,
          direction: 'ltr',
        }}>
        <Box display='flex' gap={1} width='100%'>
          <Box sx={inputFieldContainerSx}>
            <Typography variant='subtitle2' fontWeight='700'>
              نام:
            </Typography>
            <RHFTextField sx={textFieldCommonSx} name='name' fullWidth />
          </Box>
          <Box sx={inputFieldContainerSx}>
            <Typography variant='subtitle2' fontWeight='700'>
              نام خانوادگی:
            </Typography>
            <RHFTextField sx={textFieldCommonSx} name='family' fullWidth />
          </Box>
        </Box>

        <Box display='flex' gap={1} width='100%'>
          <Box sx={inputFieldContainerSx}>
            <Typography variant='subtitle2' fontWeight='700'>
              تلفن همراه:
            </Typography>
            <RHFTextField
              sx={textFieldCommonSx}
              name='phone'
              type='tel'
              slotProps={{
                htmlInput: {
                  maxLength: 11,
                },
              }}
              fullWidth
            />
          </Box>
          <Box sx={inputFieldContainerSx}>
            <Typography variant='subtitle2' fontWeight='700'>
              جنسیت:
            </Typography>
            <RHFSelect fullWidth name='gender' sx={textFieldCommonSx}>
              <MenuItem value=''>انتخاب کنید</MenuItem>
              {[
                { value: 'MALE', label: 'مرد' },
                { value: 'FEMALE', label: 'زن' },
              ].map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </RHFSelect>
          </Box>
        </Box>

        <Box sx={inputFieldContainerSx}>
          <Typography variant='subtitle2' fontWeight='700'>
            گروه:
          </Typography>
          <RHFMultiSelect
            sx={{
              ...textFieldCommonSx,
              '& .MuiInputBase-root': {
                ...textFieldCommonSx['& .MuiInputBase-root'],
                paddingY: '8px',
              },
            }}
            fullWidth
            name='group'
            options={groupOptions.map((item) => ({
              value: item.value,
              label: item.caption,
            }))}
          />
        </Box>
      </Box>

      <Box display='flex' justifyContent='space-between' alignItems='center' mx={2} mt={1}>
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

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          paddingX: '16px',
          width: '100%',
          marginTop: '24px',
        }}>
        <Button
          type='submit'
          fullWidth
          variant='contained'
          disabled={isSubmitting || !isValid}
          sx={{
            bgcolor: '#1758BA',
            height: '54px',
            color: 'white',
            fontSize: {
              xs: '13px',
              sm: '16px',
            },
            fontWeight: '700',
            borderRadius: '10px',
            boxShadow: 'none',
            '&.MuiButtonBase-root:hover, &.MuiButtonBase-root:active': {
              bgcolor: '#1758BA',
              boxShadow: 'none',
            },
          }}>
          افزودن به سبد خرید
        </Button>
        <Button
          disabled={isSubmitting}
          type='button'
          fullWidth
          sx={{
            height: '54px',
            fontWeight: '700',
            borderRadius: '10px',
            fontSize: '16px',
            color: '#1758BA',
            borderColor: '#1758BA',
            bgcolor: 'white',
            '&.MuiButtonBase-root:hover': {
              bgcolor: 'transparent',
              boxShadow: 'none',
              color: '#1758BA',
            },
            '&.Mui-disabled': {
              borderColor: '#d9d9d9',
              color: '#b0b0b0',
            },
          }}
          variant='outlined'
          onClick={() => {
            handleOpen();
            reset();
          }}>
          انصراف
        </Button>
      </Box>
    </FormProvider>
  );
}

export default IndividualSettings;
