"use client"

import { getAuthToken } from "@/utils/getAuthToken"
import { useInfiniteQuery } from "@tanstack/react-query"
import type { IGroup } from "@/app/groups/components/groupListItem"
import type { SearchBoxItem } from "@/components/ListGrid/ListGrid"

interface UseInfiniteGroupsParams {
  formId: string | number
  searchBoxList: SearchBoxItem[]
  pageSize?: number
}

interface GroupListResponse {
  content: any[]
  totalPages: number
  totalElements: number
}

const fetchGroupsPage = async ({
  formId,
  searchBoxList,
  pageParam = 0,
  pageSize = 30,
}: UseInfiniteGroupsParams & { pageParam?: number }): Promise<{ data: IGroup[]; nextPage: number | null }> => {
  const token = await getAuthToken()

  const validCombinedRestrictionList = searchBoxList.filter((item) => {
    if (!item) return false
    if (typeof item.fieldValue === "string") return item.fieldValue.trim() !== ""
    if (Array.isArray(item.fieldValue)) return item.fieldValue.length > 0
    return true
  })

  const searchFilterBoxListPayload =
    validCombinedRestrictionList.length > 0 ? [{ restrictionList: validCombinedRestrictionList }] : []

  const params: any = {
    sortList: [{ fieldName: "id", type: "DSC" }],
    page: pageParam,
    rows: pageSize,
  }

  if (searchFilterBoxListPayload.length > 0) {
    params.searchFilterBoxList = searchFilterBoxListPayload
  }

  const queryParams = new URLSearchParams()
  queryParams.set("formId", String(formId))
  queryParams.set("searchFilterModel", JSON.stringify(params))

  const res = await fetch(`/api/group/list?${queryParams.toString()}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || "دریافت لیست گروه‌ها ناموفق بود.")
  }

  const json: GroupListResponse = await res.json()

  const mapped: IGroup[] = json.content.map((item) => ({
    id: item.groupId,
    name: item.groupName,
    description: "",
    userCount: item.groupMemberCount,
    isSelected: item.isSelected || false,
  }))

  const nextPage = json.totalPages && pageParam + 1 < json.totalPages ? pageParam + 1 : null

  return { data: mapped, nextPage }
}

export const useFetchGroupsSetting = ({ formId, searchBoxList, pageSize = 10 }: UseInfiniteGroupsParams) => {
  return useInfiniteQuery({
    queryKey: ["groups-setting", formId, searchBoxList],
    queryFn: ({ pageParam = 0 }) => fetchGroupsPage({ formId, searchBoxList, pageParam, pageSize }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled: !!formId,
    staleTime: 0,
    gcTime: 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
