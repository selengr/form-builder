"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { getGroupMembersAction } from "@actions/groups/list"
import type { IUserGroupMemmerInfo, IUseFetchMembersParams } from "@/types/setting"

interface FetchMembersPageParams extends Omit<IUseFetchMembersParams, "formId"> {
  formId?: number | string
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
  const res = await getGroupMembersAction({
    groupId: String(groupId),
    pageParam,
    pageSize,
    searchBoxList: searchBoxList as any,
    formId,
  })

  if (!res.success) {
    throw new Error(res.message || "دریافت لیست اعضا ناموفق بود.")
  }

  const members = Array.isArray(res.data?.content) ? res.data.content : []
  const totalPages = res.data.totalPages
  const nextPage =
    typeof totalPages === "number" && totalPages > 0
      ? pageParam + 1 < totalPages
        ? pageParam + 1
        : null
      : members.length >= pageSize
        ? pageParam + 1
        : null

  return { data: members, nextPage }
}

export const useFetchMembersSetting = ({
  formId,
  groupId,
  searchBoxList,
  pageSize = 10,
}: Omit<IUseFetchMembersParams, "formId"> & { formId?: number | string; pageSize?: number }) => {
  return useInfiniteQuery({
    queryKey: ["members-setting", groupId, searchBoxList, formId ?? "no-form"],
    queryFn: ({ pageParam = 0 }) =>
      fetchMembersPage({ formId, groupId, searchBoxList, pageParam, pageSize }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled: !!groupId,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  })
}
