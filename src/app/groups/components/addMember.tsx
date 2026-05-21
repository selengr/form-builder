'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Box, Button, Grid, MenuItem, Typography } from '@mui/material';
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
          if (Array.isArray(data.error) && data.error.length > 0) {
            toast.error(data.error[0].title);
          } else {
            const title = JSON.parse(data.error)?.message?.[0]?.title ||
              data.error?.title || data.error

            toast.error(title)
          }
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
        width: '100%',
        bgcolor: '#F7F7FF',
        borderRadius: '8px',
        p: 2,
        pb: 4,
        my: 2,
        direction: 'ltr',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box sx={inputFieldContainerSx}>
            <Typography variant="subtitle2" fontWeight="600">
              نام:
            </Typography>
            <RHFTextField sx={textFieldCommonSx} name="name" fullWidth />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={inputFieldContainerSx}>
            <Typography variant="subtitle2" fontWeight="600">
              نام خانوادگی:
            </Typography>
            <RHFTextField sx={textFieldCommonSx} name="family" fullWidth />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={inputFieldContainerSx}>
            <Typography variant="subtitle2" fontWeight="600">
              تلفن همراه:
            </Typography>
            <RHFTextField
              sx={textFieldCommonSx}
              name="phone"
              type="tel"
              slotProps={{
                htmlInput: { maxLength: 11 },
              }}
              fullWidth
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={inputFieldContainerSx}>
            <Typography variant="subtitle2" fontWeight="600">
              جنسیت:
            </Typography>
            <RHFSelect fullWidth name="gender" sx={textFieldCommonSx}>
              <MenuItem value="">انتخاب کنید</MenuItem>
              <MenuItem value="MALE">مرد</MenuItem>
              <MenuItem value="FEMALE">زن</MenuItem>
            </RHFSelect>
          </Box>
        </Grid>
      </Grid>
    </Box>

    <Box
      sx={{
        display: 'flex',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        px: 2,
        width: '100%',
        mt: 4,
        mb: 3,
      }}
    >
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isSubmitting || !isValid}
        sx={{
          bgcolor: '#1758BA',
          height: '54px',
          color: 'white',
          fontSize: { xs: '13px', sm: '16px' },
          fontWeight: '700',
          borderRadius: '10px',
          boxShadow: 'none',
          '&:hover': {
            bgcolor: '#1758BA',
            boxShadow: 'none',
          },
        }}
      >
        افزودن عضو
      </Button>

      <Button
        disabled={isSubmitting}
        type="button"
        fullWidth
        variant="outlined"
        onClick={() => {
          handleOpen();
          reset();
        }}
        sx={{
          height: '54px',
          fontWeight: '700',
          borderRadius: '10px',
          fontSize: '16px',
          color: '#1758BA',
          borderColor: '#1758BA',
          bgcolor: 'white',
          '&:hover': {
            bgcolor: 'transparent',
            boxShadow: 'none',
            color: '#1758BA',
          },
          '&.Mui-disabled': {
            borderColor: '#d9d9d9',
            color: '#b0b0b0',
          },
        }}
      >
        انصراف
      </Button>
    </Box>
  </FormProvider>
);

}

export default AddMember;
