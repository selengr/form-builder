"use client"

import type React from "react"

import { z } from "zod"
import Image from "next/image"
import { toast } from "sonner"
import { FaEye } from "react-icons/fa";
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useInView } from "react-intersection-observer"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect, useState, useRef } from "react"
import { Box, Button, Checkbox, CircularProgress, IconButton, InputBase, Paper, Tooltip, Typography } from "@mui/material"
// hook
import { useDebounce } from "@/hooks/useDebounce"
import FormProvider from "../hook-form/FormProvider"
import type { SearchBoxItem } from "../ListGrid/ListGrid"
// services
import { AxiosApi } from "@/services/axios/AxiosApi"
// components
import { SwitchButton } from "../Switch/SwitchButton"
import ConfirmDialog from "@/components/confirm-dialog"
import { RemoveGroupConfirmModal } from "./RemoveConfirmDialog"
// hook
import { useFetchMembersSetting } from "./hook/useFetchMembersSetting"
// type
import type { MemberSettingsProps, IUserGroupMemmerInfo } from "@/types/setting"
import { useShowReportForResponder, useUpdateShowReportForResponder } from "./hook/useShowReportForResponder"

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
  memberId: z.array(z.number()).min(0, "حداقل یک عضو را انتخاب کنید."),
  showReportForResponder: z.boolean(),
})

type GroupFormSchemaType = z.infer<typeof groupFormSchema>

const MemberSettings: React.FC<MemberSettingsProps> = ({ handleClose, formId, formData, groupId }) => {
  const { push } = useRouter()
  const [inputValue, setInputValue] = useState("")
  const [searchBoxList, setSearchBoxList] = useState<SearchBoxItem[]>([
    {
      fieldName: "introducedUser.name",
      fieldOperation: "MATCH",
      fieldValue: "",
      nextConditionOperator: "OR",
    },
  ])
  const [isShowReportForResponder, setIsShowReportForResponder] = useState<boolean>(false)
  const [openShowReportForResponderDialog, setOpenShowReportForResponderDialog] = useState<boolean>(false)
  const [introducedUserJTGroupIdList, setIntroducedUserJTGroupIdList] = useState<number[]>([])
  const [introducedUserPublishIdList, setIntroducedUserPublishIdList] = useState<number[]>([])

  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [openRemoveConfirmDialog, setOpenRemoveConfirmDialog] = useState<boolean>(false);
  const [membersToRemove, setMembersToRemove] = useState<{ id: number; name: string }[]>([]);


  const isFetchingRef = useRef(false)
  const autoSelectedRef = useRef<Set<number>>(new Set())

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

  const { data: showReportForResponder } = useShowReportForResponder(Number(formId), Number(groupId))

  const {
    mutate: updateShowReport
  } = useUpdateShowReportForResponder(Number(formId), Number(groupId))

  const members = data?.pages.flatMap((page) => page.data) ?? []

  const methods = useForm<GroupFormSchemaType>({
    resolver: zodResolver(groupFormSchema),
    mode: "onChange",
    defaultValues: {
      memberId: [],
      showReportForResponder: false,
    },
  })

  const {
    watch,
    reset,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
  } = methods

  const selectedGroupIds = watch("memberId")
  const allSelected = members.length > 0 && selectedGroupIds.length === members.length

  const handleSearchFilter = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }, [])

  useEffect(() => {
    if (showReportForResponder !== undefined) {
      setValue("showReportForResponder", showReportForResponder)
      setIsShowReportForResponder(showReportForResponder)
    }
  }, [showReportForResponder, setValue])

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

  // useEffect(() => {
  //   if (members.length === 0) return

  //   const currentSelected = methods.getValues("memberId")
  //   const activeIds = members
  //     .filter((m) => m.activationLink)
  //     .map((m) => m.introducedUserJTGroupId)
  //   const newActiveIds = activeIds.filter(
  //     (id) => !currentSelected.includes(id) && !autoSelectedRef.current.has(id)
  //   )

  //   if (newActiveIds.length > 0) {
  //     const merged = [...newActiveIds]
  //     methods.setValue("memberId", merged, { shouldValidate: true })
  //     newActiveIds.forEach((id) => autoSelectedRef.current.add(id))
  //   }
  // }, [members])
    useEffect(() => {
      if (members.length === 0) return

      const currentSelected = methods.getValues("memberId")

      const activeIds = members
        .filter((m) => m.activationLink)
        .map((m) => m.introducedUserJTGroupId)

      const newActiveIds = activeIds.filter(
        (id) => !currentSelected.includes(id) &&
                !autoSelectedRef.current.has(id)
      )

      if (newActiveIds.length > 0) {
        const merged = [...currentSelected, ...newActiveIds]

        methods.setValue("memberId", merged, {
          shouldDirty: false,
          shouldValidate: true,
        })

        newActiveIds.forEach((id) => autoSelectedRef.current.add(id))
      }
    }, [members])



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
    if (members.length === 0) return

    const current = getValues("memberId")
    const allIds = members.map((m) => m.introducedUserJTGroupId)
    const allSelected = current.length === members.length

    let newSelectedIds: number[]

    if (allSelected) {
      newSelectedIds = []
      const publishIdsToRemove = members
        .filter((m) => m.activationLink && m.introducedUserPublishId)
        .map((m) => m.introducedUserPublishId!)

      setIntroducedUserPublishIdList((prev) => [
        ...new Set([...prev, ...publishIdsToRemove]),
      ])
      setIntroducedUserJTGroupIdList([])
    } else {
      newSelectedIds = allIds

      const addedJTGroupIds = members
        .filter((m) => !m.activationLink)
        .map((m) => m.introducedUserJTGroupId)
      const removedPublishIds = members
        .filter((m) => m.activationLink && m.introducedUserPublishId)
        .map((m) => m.introducedUserPublishId!)

      setIntroducedUserJTGroupIdList(addedJTGroupIds)
      setIntroducedUserPublishIdList((prev) =>
        prev.filter((id) => !removedPublishIds.includes(id))
      )
    }
    setValue("memberId", newSelectedIds, { shouldDirty: true, shouldValidate: true })
  }

  const handleMembersSubmit = useCallback(async () => {
    try {
      const promises = [];
      if (introducedUserJTGroupIdList.length > 0) {
        promises.push(
          await AxiosApi.post("/form-publish-setting/new-member-allocation", {
            formId: Number(formId),
            introducedUserJTGroupIdList
          })
        )
      }

      if (introducedUserPublishIdList.length > 0) {
        promises.push(
          await AxiosApi.post("/form-publish-setting/cancel-member-allocation", {
            formId: Number(formId),
            introducedUserPublishIdList,
          })
        )
      }

      if (promises.length > 0) {
        await Promise.all(promises);

        if (introducedUserJTGroupIdList.length > 0) {
           toast.success('با موفقیت به سبد خرید افزوده شد.', {
            className: `max-w-[300px]`,
            duration: 6000, 
            action: {
              label: 'مشاهده سبد خرید',
              onClick: () => {
                push('/purchase-order')
              },
            },
          });
        }
        if (introducedUserPublishIdList.length > 0) {
          toast.success("اعضای لغوشده با موفقیت حذف شد.");
        }
      }


      const currentShowReportValue = getValues("showReportForResponder");
      if (currentShowReportValue !== showReportForResponder) {
        updateShowReport(currentShowReportValue);
      }

      queryClient.invalidateQueries({ queryKey: ["members-setting"] })
      queryClient.invalidateQueries({ queryKey: ["groups-setting"] })
      queryClient.invalidateQueries({ queryKey: ["SHOW_REPORT"] })
      handleClose()
      reset()
     } catch (error:any) {
        toast.error( error?.message || 'انجام عملیات با خطا مواجه شد');
    }
  }, [formId, handleClose, reset, methods, introducedUserJTGroupIdList, introducedUserPublishIdList])


  const onSubmit = async () => {
    const currentSelected = getValues("memberId")
    const removedGroups = introducedUserPublishIdList.filter((id) => !currentSelected.includes(id));

    if (removedGroups.length > 0) {
      const removed: any = members.filter((g) => removedGroups.includes(g.introducedUserPublishId!));
      setMembersToRemove(removed);
      setOpenRemoveConfirmDialog(true);
      return
    }
    await handleMembersSubmit();
  };

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

  const buttonLabel = () => {
    if (introducedUserJTGroupIdList.length > 0) {
      return "افزودن به سبد خرید"
    } return "اعمال تغییرات";
  }

  return (
    <Box sx={{ position: "relative" }}>
      <FormProvider methods={methods}
      // onSubmit={handleSubmit(onSubmit)}
      >
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
              members.map((member) => {
                const currentSelected = getValues("memberId")
                const removedGroups = introducedUserPublishIdList.filter((id) => !currentSelected.includes(id));
                const shouldShowRedBackground = removedGroups.includes(member.introducedUserPublishId!)
                return (
                  !member.invalid && <Box
                    key={member.introducedUserJTGroupId}
                    display="flex"
                    alignItems="center"
                    // justifyContent="space-between"
                    position={"relative"}
                    px={1}
                    py="1px"
                    borderRadius="12px"
                    bgcolor={shouldShowRedBackground ? "#ffebee" : "white"}
                    border={shouldShowRedBackground ? "1px solid #ef5350" : "1px solid white"}
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
              }
              )
            )}
          </Box>

          {!loading && hasNextPage && (
            <Box ref={ref} display="flex" justifyContent="center" my={2}>
              {isFetchingNextPage && <CircularProgress size={24} />}
            </Box>
          )}
        </Box>


        <Box sx={{
          position: "sticky",
          bottom: '0px',
          background: "#FFF",
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

          <Box display="flex" justifyContent="center" alignItems="center" pb={2} gap="16px" px="16px" mt="14px">
            <Button
              // type="submit"
              onClick={onSubmit}
              variant="contained"
              disabled={isSubmitting || !isValid}
              sx={{
                bgcolor: "#1758BA",
                height: "54px",
                width: "161px",
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
              {buttonLabel()}
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
                width: "161px",
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
      {openRemoveConfirmDialog && <RemoveGroupConfirmModal
        open={openRemoveConfirmDialog}
        onClose={() => setOpenRemoveConfirmDialog(false)}
        groupsToRemove={membersToRemove}
        loading={isRemoving}
        title={"اعضا"}
        onConfirm={async () => {
          setIsRemoving(true);
          try {
            await handleMembersSubmit();
          } finally {
            setIsRemoving(false);
            setOpenRemoveConfirmDialog(false);
          }
        }}
      />
      }
    </Box>
  )
}

export default MemberSettings
