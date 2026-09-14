"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { getGroupsListAction } from "@actions/groups/list"
import type { SearchBoxItem } from "@/components/ListGrid/ListGrid"

interface IGroup {
  id: number;
  name: string;
  description: string;
  userCount: number;
  fullyPublished: boolean
  incompletelyPublished: boolean
  invalid?: boolean
}

interface UseInfiniteGroupsParams {
  formId: string | number
  searchBoxList: SearchBoxItem[]
  pageSize?: number
}

const fetchGroupsPage = async ({
  formId,
  searchBoxList,
  pageParam = 0,
  pageSize = 30,
}: UseInfiniteGroupsParams & { pageParam?: number }): Promise<{ data: IGroup[]; nextPage: number | null }> => {
  const res = await getGroupsListAction({
    formId,
    pageParam,
    pageSize,
    searchBoxList: searchBoxList as any,
  })

  if (!res.success) {
    throw new Error(res.message || "دریافت لیست گروه‌ها ناموفق بود.")
  }

  const mapped: IGroup[] = (res.data.content ?? []).map((item) => ({
    id: item.groupId,
    name: item.groupName,
    description: "",
    userCount: item.groupMemberCount,
    fullyPublished: item.fullyPublished || false,
    incompletelyPublished: item.incompletelyPublished || false,
    invalid: item.invalid || false,
  }))

  const totalPages = res.data.totalPages
  const nextPage =
    typeof totalPages === "number" && totalPages > 0
      ? pageParam + 1 < totalPages
        ? pageParam + 1
        : null
      : mapped.length >= pageSize
        ? pageParam + 1
        : null

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
    refetchOnMount: true,
    refetchOnWindowFocus: true
  })
}
