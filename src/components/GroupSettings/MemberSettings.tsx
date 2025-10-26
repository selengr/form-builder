"use client"

import type React from "react"

import { z } from "zod"
import Image from "next/image"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useState, useRef } from "react"
import { Box, Button, Checkbox, CircularProgress, IconButton, InputBase, Paper, Typography } from "@mui/material"
// utils
import { getAuthToken } from "@/utils/getAuthToken"
// hook
import { useDebounce } from "@/hooks/useDebounce"
import FormProvider from "../hook-form/FormProvider"
import type { SearchBoxItem } from "../ListGrid/ListGrid"
// components
import { SwitchButton } from "../Switch/SwitchButton"
import ConfirmDialog from "@/components/confirm-dialog"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { AxiosApi } from "@/services/axios/AxiosApi"
// type
import type { MemberSettingsProps, IUserGroupMemmerInfo } from "@/types/setting"
import { useFetchMembersSetting } from "./hook/useFetchMembersSetting"
import { useInView } from "react-intersection-observer"

const buttonStylesAlert = {
  height: "50px",
  fontWeight: "400",
  fontSize: "15px",
  borderRadius: "10px",
  boxShadow: "none",
  transition: "background-color 0.3s, border-color 0.3s",
  bgcolor: "#1758BA",
  borderColor: "#1758BA",
  "&:hover": {
    bgcolor: "#0F4C8A",
  },
  "&:active": {
    bgcolor: "#0A3A6A",
  },
}

const groupFormSchema = z.object({
  memberId: z.array(z.number()).min(1, "حداقل یک عضو را انتخاب کنید."),
  showReportForResponder: z.boolean(),
})

type GroupFormSchemaType = z.infer<typeof groupFormSchema>

const MemberSettings: React.FC<MemberSettingsProps> = ({ handleClose, formId, formData, groupId }) => {
  const { push } = useRouter()
  const [inputValue, setInputValue] = useState("")
  const [searchBoxList, setSearchBoxList] = useState<SearchBoxItem[]>([
    {
      fieldName: "name",
      fieldOperation: "MATCH",
      fieldValue: "",
      nextConditionOperator: "OR",
    },
  ])
  const [isShowReportForResponder, setIsShowReportForResponder] = useState<boolean>(false)
  const [openShowReportForResponderDialog, setOpenShowReportForResponderDialog] = useState<boolean>(false)
  const [introducedUserJTGroupIdList, setIntroducedUserJTGroupIdList] = useState<number[]>([])
  const [introducedUserPublishIdList, setIntroducedUserPublishIdList] = useState<number[]>([])
  const isFetchingRef = useRef(false)

  const queryClient = useQueryClient()
  const debouncedValue = useDebounce(inputValue, 500)
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

  const methods = useForm<GroupFormSchemaType>({
    resolver: zodResolver(groupFormSchema),
    mode: "onChange",
    defaultValues: {
      memberId: [],
      showReportForResponder: formData?.showReportForResponder || false,
    },
  })

  const {
    watch,
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, errors },
  } = methods

  const selectedGroupIds = watch("memberId")
  const allSelected = members.length > 0 && selectedGroupIds.length === members.length

  const handleSearchFilter = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }, [])

  useEffect(() => {
    if (isFetchingNextPage) {
      isFetchingRef.current = true
    } else {
      const timer = setTimeout(() => {
        isFetchingRef.current = false
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isFetchingNextPage])

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ["members-setting", formId, groupId] })
    }
  }, [queryClient, formId, groupId])

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingRef.current && !loading) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, loading])

  useEffect(() => {
    setSearchBoxList((prev) =>
      prev.map((item: SearchBoxItem) => ({
        ...item,
        fieldValue: debouncedValue || "",
      })),
    )
  }, [debouncedValue, setSearchBoxList])

//   useEffect(() => {
//   if (members.length > 0) {
//     const activeIds = members.filter(m => m.activationLink).map(m => m.introducedUserJTGroupId)
//     const current = getValues("memberId")
//     const merged = Array.from(new Set([...current, ...activeIds]))
//     setValue("memberId", merged, { shouldValidate: true })
//   }
// }, [members, setValue, getValues])

const didSetDefault = useRef(false)

useEffect(() => {
  if (members.length === 0 || didSetDefault.current) return

  const activeIds = members
    .filter((m) => m.activationLink)
    .map((m) => m.introducedUserJTGroupId)

  if (activeIds.length > 0) {
    methods.setValue("memberId", activeIds, { shouldValidate: true })
    didSetDefault.current = true 
  }
}, [members, methods])





  const handleToggleGroup = (member: IUserGroupMemmerInfo) => {
    const current = getValues("memberId")
    const isSelected = current.includes(member.introducedUserJTGroupId)

    const updated = isSelected
      ? current.filter((id) => id !== member.introducedUserJTGroupId)
      : [...current, member.introducedUserJTGroupId]
    setValue("memberId", updated, { shouldDirty: true, shouldValidate: true })

    if (isSelected) {
      if (member.activationLink) {
        if (member.introducedUserPublishId)
          setIntroducedUserPublishIdList((prev) => {
            if (prev.includes(member.introducedUserPublishId!)) return prev
            return [...prev, member.introducedUserPublishId!]
          })
      } else {
        setIntroducedUserJTGroupIdList((prev) => prev.filter((id) => id !== member.introducedUserJTGroupId))
      }
    } else {
      if (member.activationLink) {
        setIntroducedUserPublishIdList((prev) => prev.filter((id) => id !== member.introducedUserPublishId))
      } else {
        setIntroducedUserJTGroupIdList((prev) => {
          if (prev.includes(member.introducedUserJTGroupId)) return prev
          return [...prev, member.introducedUserJTGroupId]
        })
      }
    }
  }

  const handleToggleAll = () => {
    const newSelectedIds = allSelected ? [] : members.map((group) => group.introducedUserJTGroupId)
    setValue("memberId", newSelectedIds, { shouldDirty: true, shouldValidate: true })
  }

  console.log('introducedUserJTGroupIdList', introducedUserJTGroupIdList)
  console.log('introducedUserPublishIdList', introducedUserPublishIdList)

  const onSubmit = useCallback(async () => {
    const token = await getAuthToken()

    try {
      if (introducedUserJTGroupIdList.length > 0) {
        await AxiosApi.post("/form-publish-setting/new-member-allocation", {
          formId: Number(formId),
          introducedUserJTGroupIdList,
          showReportForResponder: getValues("showReportForResponder"),
        })
      }

      if (introducedUserPublishIdList.length > 0) {
        await AxiosApi.post("/form-publish-setting/cancel-member-allocation", {
          formId: Number(formId),
          introducedUserPublishIdList,
        })
      }

      queryClient.invalidateQueries({ queryKey: ["datas_builder_query"] })
      toast.success("با موفقیت به سبد خرید افزوده شد.")
      handleClose()
      reset()
    } catch (err) {
      toast.error("خطا در برقراری ارتباط با سرور.")
      console.error("Group publish error:", err)
    }
  }, [formId, handleClose, reset, methods, introducedUserJTGroupIdList, introducedUserPublishIdList])

  const handleShowReportForResponder = () => {
    if (formData?.isCreatedSoloReport) {
      const currentValue = getValues("showReportForResponder")
      setValue("showReportForResponder", !currentValue, { shouldDirty: false })
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
     <Box sx={{position:"relative"}}>
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box
        bgcolor="#f7f7f7"
        borderRadius={2}
        width={"100%"}
        p={2}
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        <Paper
          sx={{
            boxShadow: "unset",
            border: "1px solid #C9C9C9",
            display: "flex",
            alignItems: "center",
            width: "100%",
            py: "4px",
            borderRadius: "15px !important",
            margin: "0px !important",
            marginBottom: "8px",
            maxWidth: "80% !important",
          }}
        >
          <InputBase
            onChange={handleSearchFilter}
            sx={{ ml: 1, flex: 1, textAlign: "end" }}
            placeholder="جستجو با نام و نام خانوادگی، کانون و ... انجام می‌شود"
            inputProps={{ "aria-label": "جستجو" }}
          />
          <IconButton sx={{ p: "8px", mr: 2 }}>
            <Image
              src="/images/home-page/search.svg"
              width={23}
              height={23}
              alt="جستجو"
              style={{ cursor: "pointer" }}
            />
          </IconButton>
        </Paper>

        <Box display="flex" alignItems="center" gap={1} mb={1} mt={4} width={"100%"}>
          <Checkbox
            checked={allSelected}
            indeterminate={selectedGroupIds.length > 0 && selectedGroupIds.length < members.length}
            onChange={handleToggleAll}
          />
          <Typography>انتخاب همه</Typography>
        </Box>

        <Box display="flex" flexDirection="column" gap="6px" mb={2} width={"100%"}>
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
              <Box
                key={member.introducedUserJTGroupId}
                display="flex"
                bgcolor="white"
                alignItems="center"
                justifyContent="space-between"
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
                <Typography fontSize="14px" className="pl-2">
                  {member.userGender}
                </Typography>
              </Box>
            ))
          )}
        </Box>

        {!loading && hasNextPage && (
          <Box ref={ref} display="flex" justifyContent="center" my={2}>
            {isFetchingNextPage && <CircularProgress size={24} />}
          </Box>
        )}
      </Box>


   <Box  sx={{
        position: "sticky",
        bottom: '0px',
        background : "#FFF",
      }}
        pr={1} pl={2}
        >

      {errors.memberId && (
        <Typography color="error" fontSize="12px" sx={{ pt: 1, px: 2 }}>
          {errors.memberId.message}
        </Typography>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" pt={1}>
        <Typography variant="subtitle2" fontWeight={500} fontSize="14px">
          نمایش نتیجه به پاسخ دهنده
        </Typography>
        <SwitchButton
          onChange={handleShowReportForResponder}
          checked={isShowReportForResponder}
          sx={{
            "& .MuiInputBase-root": {
              borderRadius: "10px",
              fontWeight: 600,
              height: 42,
            },
          }}
        />
      </Box>

      <Box  display="flex" justifyContent="center" alignItems="center" pb={2} gap="16px" px="16px" mt="14px">
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting || !isValid}
          sx={{
            bgcolor: "#1758BA",
            height: "54px",
            width : "131px",
            color: "white",
            fontSize: { xs: "13px", sm: "16px" },
            fontWeight: "700",
            borderRadius: "10px",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#1758BA",
              boxShadow: "none",
            },
          }}
        >
          ثبت
        </Button>

        <Button
          variant="outlined"
          onClick={() => {
            handleClose()
            reset()
          }}
          disabled={isSubmitting}
          sx={{
            height: "54px",
            fontWeight: "700",
              width : "131px",
            borderRadius: "10px",
            fontSize: "16px",
            color: "#1758BA",
            borderColor: "#1758BA",
            bgcolor: "white",
            "&:hover": {
              bgcolor: "transparent",
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              borderColor: "#d9d9d9",
              color: "#b0b0b0",
            },
          }}
        >
          انصراف
        </Button>
      </Box>
      </Box>
      <ConfirmDialog
        content="تا زمانی که قالب گزارش انفرادی نساخته باشید نمیتواند این تیک را بزند "
        open={openShowReportForResponderDialog}
        title="اخطار"
        onClose={toggleConfirm}
        cancelText="انصراف"
        action={
          <Button
            type="submit"
            fullWidth
            disableRipple
            variant="contained"
            sx={{ ...buttonStylesAlert }}
            onClick={handleRedirection}
          >
            برو به قالب گزارش
          </Button>
        }
      />
    </FormProvider>
    </Box>
  )
}

export default MemberSettings
