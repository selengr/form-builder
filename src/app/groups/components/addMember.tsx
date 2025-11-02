'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Box, Button, MenuItem, Typography } from '@mui/material';
// utils
import { getAuthToken } from '@/utils/getAuthToken';
// components
import FormProvider, { RHFSelect, RHFTextField } from '@/components/hook-form';

interface AddMemberProps {
  handleOpen: () => void;
  groupId: number;
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
  })
});

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

const AddMember: React.FC<AddMemberProps> = ({ handleOpen, groupId }) => {
  const queryClient = useQueryClient();

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      family: '',
      phone: '',
      gender: undefined,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
    setError,
  } = methods;

  async function onSubmit(values: propertiesFormSchemaType) {
    const token = await getAuthToken();

    try {
      const response = await fetch('/api/group/member/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: values.name,
          lname: values.family,
          username: values.phone,
          gender: values.gender,
          groupId: groupId
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
          const title = JSON.parse(data.error)?.message?.[0]?.title ||
            data.error?.title || data.error

          toast.error(title)
        } else {
          toast.error('خطای ناشناخته از سمت سرور');
        }
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["members-setting", groupId],
        exact: false,
      })
      toast.success('با موفقیت به گروه افزوده شد.');
      handleOpen();
      reset();
    } catch (error) {
      toast.error('خطا در برقراری ارتباط با سرور.');
    }
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
          paddingBottom: 4,
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

      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          paddingX: '16px',
          width: '100%',
          marginTop: '32px',
          marginBottom: '24px',
        }}>
        <Button
          type='submit'
          fullWidth
          variant='contained'
          disabled={isSubmitting || !isValid}
          loading={isSubmitting}
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
          افزودن عضو
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

export default AddMember;
