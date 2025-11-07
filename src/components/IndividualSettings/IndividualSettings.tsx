'use client';

import { z } from 'zod';
import { toast } from 'sonner';
import { FaEye } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import FormProvider, { RHFSelect, RHFTextField } from '../hook-form';
import { Box, Button,Tooltip ,Checkbox, CircularProgress, MenuItem, Typography } from '@mui/material';
// utils
import { getAuthToken } from '@/utils/getAuthToken';
// components
import { SwitchButton } from '../Switch/SwitchButton';
import ConfirmDialog from '@/components/confirm-dialog';
// hook
import { useFetchMembersSetting } from "../GroupSettings/hook/useFetchMembersSetting"
import { SearchBoxItem } from '../ListGrid/ListGrid';
import { IUserGroupMemmerInfo } from '@/types/setting';
import { useInView } from 'react-intersection-observer';

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


interface IndividualSettingsProps {
  handleOpen: () => void;
  formId: string | number;
  formData: {
    id?: number | null
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
  showReportForResponder: z.boolean(),
  show: z.boolean().default(false).optional(),
  memberId: z.array(z.number()).min(0, "حداقل یک عضو را انتخاب کنید."),
});

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

const IndividualSettings: React.FC<IndividualSettingsProps> = ({ handleOpen, formId, formData }) => {
  const { push } = useRouter()
  const [isShowReportForResponder, setIsShowReportForResponder] = useState<boolean>(false);
  const [openShowReportForResponderDialog, setOpenShowReportForResponderDialog] = useState<boolean>(false);
  const [searchBoxList, setSearchBoxList] = useState<SearchBoxItem[]>([
    {
      fieldName: "introducedUser.name",
      fieldOperation: "MATCH",
      fieldValue: "",
      nextConditionOperator: "OR",
    },
  ])
  const groupId : "default" = "default"
  const queryClient = useQueryClient();

  const autoSelectedRef = useRef<Set<number>>(new Set())
    const { ref, inView } = useInView({
      threshold: 0.1,
    })
  

    const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isLoading: loading,
      error,
    } = useFetchMembersSetting({
      formId,
      groupId,
      searchBoxList,
    })
  const members = data?.pages.flatMap((page) => page.data) ?? []

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      family: '',
      show: false,
      memberId: [],
      gender: undefined,  
      showReportForResponder: formData?.showReportForResponder || false,
    },
  });

  
  const {
    watch,
    reset,
    setValue,
    setError,
    getValues,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;
  const selectedGroupIds = watch("memberId")

    useEffect(() => {
    if (members.length === 0) return

    const currentSelected = methods.getValues("memberId")
    const activeIds = members
      .filter((m) => m.activationLink)
      .map((m) => m.introducedUserJTGroupId)
    const newActiveIds = activeIds.filter(
      (id) => !currentSelected.includes(id) && !autoSelectedRef.current.has(id)
    )

    if (newActiveIds.length > 0) {
      const merged = [...newActiveIds]
      methods.setValue("memberId", merged, { shouldValidate: true })
      newActiveIds.forEach((id) => autoSelectedRef.current.add(id))
    }
  }, [members])

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
          // setGroupOptions(data.dataList);
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

  const handleToggleGroup = (member: IUserGroupMemmerInfo) => {
      // const current = getValues("memberId")
      // const isSelected = current.includes(member.introducedUserJTGroupId)
  
      // const updated = isSelected
      //   ? current.filter((id) => id !== member.introducedUserJTGroupId)
      //   : [...current, member.introducedUserJTGroupId]
      // setValue("memberId", updated, { shouldDirty: true, shouldValidate: true })
  
      // if (isSelected) {
      //   if (member.activationLink) {
      //     if (member.introducedUserPublishId)
      //       setIntroducedUserPublishIdList((prev) => {
      //         if (prev.includes(member.introducedUserPublishId!)) return prev
      //         return [...prev, member.introducedUserPublishId!]
      //       })
      //   } else {
      //     setIntroducedUserJTGroupIdList((prev) => prev.filter((id) => id !== member.introducedUserJTGroupId))
      //   }
      // } else {
      //   if (member.activationLink) {
      //     setIntroducedUserPublishIdList((prev) => prev.filter((id) => id !== member.introducedUserPublishId))
      //   } else {
      //     setIntroducedUserJTGroupIdList((prev) => {
      //       if (prev.includes(member.introducedUserJTGroupId)) return prev
      //       return [...prev, member.introducedUserJTGroupId]
      //     })
      //   }
      // }
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
         <Box display='flex' justifyContent='space-between' alignItems='center' mx={2} mt={2}>
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

   <Box display="flex" flexDirection="column" gap="7px" mt={5} mb={2} width={"100%"}>
            {loading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error" textAlign="center">
                {error.message}
              </Typography>
            ) : (
              members.map((member) => (
                  !member.invalid && <Box
                    key={member.introducedUserJTGroupId}
                    display="flex"
                    bgcolor="white"
                    alignItems="center"
                    // justifyContent="space-between"
                    position={"relative"}
                    px={1}
                    py="1px"
                    borderRadius="12px"
                  >
                    <Checkbox
                      checked={selectedGroupIds.includes(member.introducedUserJTGroupId)}
                      onChange={() => handleToggleGroup(member)}
                    />
                    <Typography flex={1}>
                      {member.userName} {member.userFamily}
                    </Typography>
                    <Typography position="absolute" right={120} fontSize="14px">
                      نام کاربری: {member.userUsername}
                    </Typography>

                    {member.showReportForResponder && (
                      <Box sx={{ position: "absolute", right: 35 }}>
                        <Tooltip key={member.userUsername} title="نمایش نتیجه به پاسخ دهنده" followCursor arrow placement='top'>
                          <div className='truncate' dir='rtl'>
                            <FaEye color='#1758BA' />
                          </div>
                        </Tooltip>
                      </Box>
                    )}
                    <Typography position="absolute" right={1} fontSize="14px" className="pl-2">
                      {member.userGender}
                    </Typography>

                  </Box>) 
              )
            )}
          </Box>
      </Box>

          {!loading && hasNextPage && (
            <Box ref={ref} display="flex" justifyContent="center" my={2}>
              {isFetchingNextPage && <CircularProgress size={24} />}
            </Box>
          )}
     

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          paddingX: '16px',
          width: '100%',
          marginTop: '24px',
          marginBottom: '16px',
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

export default IndividualSettings;
