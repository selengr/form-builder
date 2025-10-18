'use client';

import { z } from 'zod';
import Image from 'next/image';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { Box, Button, Checkbox, CircularProgress, IconButton, InputBase, Paper, Typography } from '@mui/material';
// utils
import { getAuthToken } from '@/utils/getAuthToken';
// hook
import { useDebounce } from '@/hooks/useDebounce';
import FormProvider from '../hook-form/FormProvider';
import { SearchBoxItem } from '../ListGrid/ListGrid';
// components
import { SwitchButton } from '../Switch/SwitchButton';
import ConfirmDialog from '@/components/confirm-dialog';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosApi } from '@/services/axios/AxiosApi';

interface IUserGroupMemmerInfo {
  activationLink: boolean;
  formBuilderId: number;
  groupId: number;
  introducedUserJTGroupId: number;
  introducedUserPublishId: number | null;
  showReportForResponder: boolean;
  userFamily: string;
  userGender: string;
  userName: string;
  userUsername: string;
}


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

const groupFormSchema = z.object({
  memberId: z.array(z.number()).min(1, 'حداقل یک گروه را انتخاب کنید.'),
  showReportForResponder: z.boolean(),
});

type GroupFormSchemaType = z.infer<typeof groupFormSchema>;

interface MemberSettingsProps {
  handleOpen: () => void;
  formId: string | number;
  formData: {
    isCreatedSoloReport: boolean | null
    showReportForResponder: boolean | null
  };
  groupId: number | null;
}

const MemberSettings: React.FC<MemberSettingsProps> = ({ handleOpen, formId, formData, groupId = 87 }) => {
  const { push } = useRouter()
  const [members, setMembers] = useState<IUserGroupMemmerInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [searchBoxList, setSearchBoxList] = useState<SearchBoxItem[]>([
    {
      fieldName: 'name',
      fieldOperation: 'MATCH',
      fieldValue: '',
      nextConditionOperator: 'OR',
    },
  ])
  const [isShowReportForResponder, setIsShowReportForResponder] = useState<boolean>(false);
  const [openShowReportForResponderDialog, setOpenShowReportForResponderDialog] = useState<boolean>(false);
  const [openCancelGroupAllocationDialog, setOpenCancelGroupAllocationDialog] = useState(false);

  const [introducedUserJTGroupIdList, setIntroducedUserJTGroupIdList] = useState<number[]>([]);
  const [introducedUserPublishIdList, setIntroducedUserPublishIdList] = useState<number[]>([]);

  const queryClient = useQueryClient();
  const debouncedValue = useDebounce(inputValue, 500);

  const methods = useForm<GroupFormSchemaType>({
    resolver: zodResolver(groupFormSchema),
    mode: 'onChange',
    defaultValues: {
      memberId: [],
      showReportForResponder: formData?.showReportForResponder || false,
    },
  });

  const {
    watch,
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, errors },
  } = methods;

  const selectedGroupIds = watch('memberId');
  const allSelected = members.length > 0 && selectedGroupIds.length === members.length;

  const handleSearchFilter = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    },
    []
  );

  useEffect(() => {
    setSearchBoxList(prev =>
      prev.map((item: SearchBoxItem) => ({
        ...item,
        fieldValue: debouncedValue || "",
      }))
    );
  }, [debouncedValue, setSearchBoxList]);


  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = await getAuthToken();

    const validCombinedRestrictionList = [...searchBoxList].filter((item) => {
      if (item === undefined || item === null) return false;
      if (typeof item.fieldValue === 'string') {
        return item.fieldValue !== '';
      }
      if (Array.isArray(item.fieldValue)) {
        return item.fieldValue.length > 0;
      }
      return true;
    });

    const searchFilterBoxListPayload = [{ restrictionList: validCombinedRestrictionList }];

    const params = {
      searchFilterBoxList: searchFilterBoxListPayload,
      sortList: [{ fieldName: 'id', type: 'DSC' }],
      page: 0,
      rows: 100,
    };

    try {
      const encoded = encodeURIComponent(JSON.stringify(params));

      const { data } = await AxiosApi.get(`/user-group/introducer/group-listgrid/${Number(groupId)}/members?searchFilterModel=${encoded}&formId=${638}`);
      // const res = await fetch(`/api/group/list/${formId}`, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      // if (!res.ok) {
      //   const errorData = await res.json();
      //   throw new Error(errorData.error || 'دریافت لیست گروه‌ها ناموفق بود.');
      // }

      // const data: GroupListResponse = await res.json();
      const members = Array.isArray(data?.content) ? data.content : [];
      setMembers(members);

      const activeIds = members
        .filter((m: any) => m.activationLink)
        .map((m: any) => m.introducedUserJTGroupId);
      setValue('memberId', activeIds);

    } catch (err: any) {
      setError(err?.message || 'خطای نامشخصی رخ داده است.');
    } finally {
      setLoading(false);
    }
  }, [groupId, formId, searchBoxList, setValue, searchBoxList]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleToggleGroup = (member: IUserGroupMemmerInfo) => {
    const current = getValues("memberId");
    const isSelected = current.includes(member.introducedUserJTGroupId);

    const updated = isSelected
      ? current.filter((id) => id !== member.introducedUserJTGroupId)
      : [...current, member.introducedUserJTGroupId];
    setValue("memberId", updated, { shouldDirty: true, shouldValidate: true });

    if (isSelected) {
      if (member.activationLink) {
        if (member.introducedUserPublishId)
          setIntroducedUserPublishIdList((prev) => {
            if (prev.includes(member.introducedUserPublishId!)) return prev;
            return [...prev, member.introducedUserPublishId!];
          });
      } else {
        setIntroducedUserJTGroupIdList((prev) =>
          prev.filter((id) => id !== member.introducedUserJTGroupId)
        );
      }
    } else {
      if (member.activationLink) {
        setIntroducedUserPublishIdList((prev) =>
          prev.filter((id) => id !== member.introducedUserPublishId)
        );
      } else {
        setIntroducedUserJTGroupIdList((prev) => {
          if (prev.includes(member.introducedUserJTGroupId)) return prev;
          return [...prev, member.introducedUserJTGroupId];
        });
      }
    }
  };


  const handleToggleAll = () => {
    const newSelectedIds = allSelected ? [] : members.map((group) => group.introducedUserJTGroupId);
    setValue('memberId', newSelectedIds, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = useCallback(
    async () => {
      const token = await getAuthToken();

      try {

        if (introducedUserJTGroupIdList.length > 0) {
          await AxiosApi.post('/form-publish-setting/new-member-allocation', {
            formId: Number(formId),
            introducedUserJTGroupIdList,
            showReportForResponder: getValues('showReportForResponder'),
          });
        }


        if (introducedUserPublishIdList.length > 0) {
          await AxiosApi.post('/form-publish-setting/cancel-member-allocation', {
            formId: Number(formId),
            introducedUserPublishIdList,
          });
        }

        // const response = await fetch('/api/publish/group', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: `Bearer ${token}`,
        //   },
        //   body: JSON.stringify({
        //     formId: Number(formId),
        //     memberId: values.memberId,
        //     showReportForResponder: values.showReportForResponder,
        //   }),
        // });

        // const data = await response.json();

        // if (!response.ok) {
        //   if (data.error && data.details) {
        //     data.details.forEach((err: any) => {
        //       if (err.path && err.path[0]) {
        //         if (err.path[0] === 'memberId') {
        //           methods.setError('memberId', {
        //             type: 'manual',
        //             message: err.message || 'خطا در فیلد گروه',
        //           });
        //         }
        //       }
        //     });
        //   } else if (data.error) {
        //     toast.error(data.error);
        //   } else {
        //     toast.error('خطای ناشناخته از سمت سرور');
        //   }
        //   return;
        // }

        queryClient.invalidateQueries({ queryKey: ['datas_builder_query'] });
        toast.success('با موفقیت به سبد خرید افزوده شد.');
        handleOpen();
        reset();
      } catch (err) {
        toast.error('خطا در برقراری ارتباط با سرور.');
        console.error('Group publish error:', err);
      }
    },
    [formId, handleOpen, reset, methods, introducedUserJTGroupIdList, introducedUserPublishIdList]

  );

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

  const handleOpenCancelGroupAllocation = useCallback(() => {
    setOpenCancelGroupAllocationDialog((prev) => !prev);
  }, []);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box bgcolor='#f7f7f7' mt={2} p={2} display='flex' flexDirection='column'>
        <Paper
          sx={{
            boxShadow: 'unset',
            border: '1px solid #C9C9C9',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            py: 1,
            borderRadius: '12px',
            mb: 2,
          }}>
          <InputBase onChange={handleSearchFilter} sx={{ ml: 1, flex: 1, textAlign: 'end' }} placeholder='کاوش بر اساس نام پایگاه داده' inputProps={{ 'aria-label': 'جستجو' }} />
          <IconButton sx={{ p: '8px' }}>
            <Image src='/images/home-page/search.svg' width={23} height={23} alt='جستجو' style={{ cursor: 'pointer' }} />
          </IconButton>
        </Paper>

        <Box display='flex' alignItems='center' gap={1} mb={1}>
          <Checkbox checked={allSelected} indeterminate={selectedGroupIds.length > 0 && selectedGroupIds.length < members.length} onChange={handleToggleAll} />
          <Typography>انتخاب همه</Typography>
        </Box>

        <Box display='flex' flexDirection='column' gap={2}>
          {loading ? (
            <Box display='flex' justifyContent='center' my={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color='error' textAlign='center'>
              {error}
            </Typography>
          ) : (
            members.map((member) => (
              <Box key={member.introducedUserJTGroupId} display='flex' gap={1} bgcolor='white' alignItems='center' justifyContent='space-between' px={2} py={1} borderRadius='12px'>
                <Checkbox
                  checked={selectedGroupIds.includes(member.introducedUserJTGroupId)}
                  onChange={() => handleToggleGroup(member)}
                />
                <Typography flex={1}>{member.userName}</Typography>
                <Typography fontSize='14px'>عضو: {member.userGender} نفر</Typography>
              </Box>
            ))
          )}
        </Box>
      </Box>

      {errors.memberId && (
        <Typography color='error' fontSize='12px' sx={{ mt: 1, px: 2 }}>
          {errors.memberId.message}
        </Typography>
      )}

      <Box display='flex' justifyContent='space-between' alignItems='center' mx={2} mt={3}>
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

      <Box display='flex' justifyContent='space-between' alignItems='center' gap='16px' px='16px' mt='24px'>
        <Button
          type='submit'
          fullWidth
          variant='contained'
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
          }}>
          افزودن به سبد خرید
        </Button>

        <Button
          fullWidth
          variant='outlined'
          onClick={() => {
            handleOpen();
            reset();
          }}
          disabled={isSubmitting}
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
            },
            '&.Mui-disabled': {
              borderColor: '#d9d9d9',
              color: '#b0b0b0',
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
};

export default MemberSettings;
