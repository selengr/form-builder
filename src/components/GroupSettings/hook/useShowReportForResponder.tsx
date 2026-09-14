"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getShowReportForResponderAction,
  updateShowReportForResponderAction,
} from "@actions/groups/member"

const fetchShowReportForResponder = async (formId: number, groupId: number) => {
  const res = await getShowReportForResponderAction({ formId, groupId })

  if (!res.success) {
    throw new Error(res.message || "دریافت تنظیمات نمایش نتیجه ناموفق بود.")
  }

  return res.data.showReportForResponder
}

export const useShowReportForResponder = (formId: number, groupId: number) => {
  return useQuery({
    queryKey: ["SHOW_REPORT", formId, groupId],
    queryFn: () => fetchShowReportForResponder(formId, groupId),
    enabled: !!formId && !!groupId,
    staleTime: 0,
    gcTime: 600000,
    retry: 3,
  })
}

const updateShowReportForResponder = async (
  formId: number,
  groupId: number,
  showReportForResponder: boolean,
) => {
  const res = await updateShowReportForResponderAction({
    formId,
    groupId,
    showReportForResponder,
  })

  if (!res.success) {
    throw new Error(res.message || "خطا در به‌روزرسانی تنظیمات نمایش نتیجه.")
  }

  return res.data
}

export const useUpdateShowReportForResponder = (formId: number, groupId: number) => {
  return useMutation({
    mutationKey: ["update_showReportForResponder", formId, groupId],
    mutationFn: (showReportForResponder: boolean) =>
      updateShowReportForResponder(formId, groupId, showReportForResponder),
    onError: (error) => {
      toast.error("خطا در به‌روزرسانی تنظیمات نمایش نتیجه.")
      console.error("Update show report error:", error)
    },
  })
}
