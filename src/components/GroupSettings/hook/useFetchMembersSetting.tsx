"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { getAuthToken } from "@/utils/getAuthToken"
import type { IUserGroupMemmerInfo, IUseFetchMembersParams } from "@/types/setting"

interface MembersResponse {
  content: IUserGroupMemmerInfo[]
  totalPages: number
  totalElements: number
}

interface FetchMembersPageParams extends IUseFetchMembersParams {
  pageParam?: number
  pageSize?: number
}

const fetchMembersPage = async ({
  formId,
  groupId,
  searchBoxList,
  pageParam = 0,
  pageSize = 30,
}: FetchMembersPageParams): Promise<{ data: IUserGroupMemmerInfo[]; nextPage: number | null }> => {
  const token = await getAuthToken()

  const validCombinedRestrictionList = searchBoxList.filter((item) => {
    if (!item) return false
    if (typeof item.fieldValue === "string") return item.fieldValue.trim() !== ""
    if (Array.isArray(item.fieldValue)) return item.fieldValue.length > 0
    return true
  })

  const searchFilterBoxListPayload =
    validCombinedRestrictionList.length > 0 ? [{ restrictionList: validCombinedRestrictionList }] : []

  const params = {
    searchFilterBoxList: searchFilterBoxListPayload,
    sortList: [{ fieldName: "id", type: "DSC" }],
    page: pageParam,
    rows: pageSize,
  }

  const encoded = encodeURIComponent(JSON.stringify(params))

  const res = await fetch(`/api/group/list/${groupId}?searchFilterModel=${encoded}&formId=${formId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || "دریافت لیست اعضا ناموفق بود.")
  }

  const data: MembersResponse = await res.json()
  const members = Array.isArray(data?.content) ? data.content : []

  const nextPage = data.totalPages && pageParam + 1 < data.totalPages ? pageParam + 1 : null

  return { data: members, nextPage }
}

export const useFetchMembersSetting = ({
  formId,
  groupId,
  searchBoxList,
  pageSize = 10,
}: IUseFetchMembersParams & { pageSize?: number }) => {
  return useInfiniteQuery({
    queryKey: ["members-setting", formId, groupId, searchBoxList],
    queryFn: ({ pageParam = 0 }) => fetchMembersPage({ formId, groupId, searchBoxList, pageParam, pageSize }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled: !!formId && !!groupId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}