"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { getAuthToken } from "@/utils/getAuthToken"
import { toast } from "sonner";


const API_BASE = '/api/group/member/show-report';

const fetchShowReportForResponder = async (formId: number, groupId: number) => {
  const token = await getAuthToken()

  const url =  `${API_BASE}/${formId}/${groupId}`

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || "دریافت لیست اعضا ناموفق بود.")
  }

  const data : { showReportForResponder:boolean } = await res.json()

  return data.showReportForResponder
}



export const useShowReportForResponder = (formId: number, groupId: number) => {
  return useQuery({
    queryKey: ['SHOW_REPORT'],
    queryFn: () => fetchShowReportForResponder(formId, groupId),
    enabled: !!formId && !!groupId,
    staleTime: 0,
    gcTime: 600000,
    retry: 3,
  });
}


const updateShowReportForResponder = async (formId: number, groupId: number, showReportForResponder:boolean) => {
    const token = await getAuthToken();
     const url =  `${API_BASE}/${formId}/${groupId}`
    try {
       await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          showReportForResponder
        }),
      });

    } catch (error) {
      toast.error('خطا در برقراری ارتباط با سرور.');
    }
};  


export const useUpdateShowReportForResponder = (formId: number, groupId: number) => {
  const mutation = useMutation({
    mutationKey: ['update_showReportForResponder'],
    mutationFn: (showReportForResponder:boolean) => updateShowReportForResponder(formId, groupId, showReportForResponder),

          onError: (error) => {
            toast.error("خطا در به‌روزرسانی تنظیمات نمایش نتیجه.");
            console.error("Update show report error:", error);
          }
  });

  return mutation;
};
