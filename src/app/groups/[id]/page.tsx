'use client'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import React, { Suspense, useEffect, useState, useRef } from 'react'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import TrashIcon from '@/../public/images/purchase-order/trashMts.svg'
import { CreateGroupDialog } from '@/app/groups/components/createGroupDialog'
import { InfoRow } from '@/components/common/infoRow'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Box, CircularProgress, Typography } from '@mui/material'

// Hook + types
import { useFetchMembersSetting } from '@/components/GroupSettings/hook/useFetchMembersSetting'
import type { IUserGroupMemmerInfo } from '@/types/setting'
import { SearchBoxItem } from '@/components/ListGrid/ListGrid'

export default function GroupDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const groupId = typeof params.id === 'string' ? parseInt(params.id, 10) : null

  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [searchBoxList, setSearchBoxList] = useState<SearchBoxItem[]>([
    { fieldName: 'introducedUser.name', fieldOperation: 'MATCH', fieldValue: '', nextConditionOperator: 'OR' },
  ])

  // Fetch members
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useFetchMembersSetting({
    formId: 100010, 
    groupId,
    searchBoxList,
  })

  const members: IUserGroupMemmerInfo[] = data?.pages.flatMap((page) => page.data) ?? []

  // Checkbox logic
  const allUsersSelected = members.length > 0 && selectedUsers.length === members.length
  const someUsersSelected = selectedUsers.length > 0 && selectedUsers.length < members.length

  const handleUserCheckboxChange = (userId: number, isChecked: boolean) => {
    setSelectedUsers((prev) =>
      isChecked ? [...prev, userId] : prev.filter((id) => id !== userId)
    )
  }

  const handleSelectAllUsers = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedUsers(event.target.checked && members.length > 0 ? members.map((m) => m.introducedUserJTGroupId) : [])
  }

  const handleDeleteSelectedUsers = () => {
    if (selectedUsers.length === 0) {
      alert('هیچ کاربری برای حذف انتخاب نشده است.')
      return
    }
    if (confirm(`آیا از حذف ${selectedUsers.length} کاربر انتخاب شده مطمئن هستید؟`)) {
      // Here you would call API to delete users if such endpoint exists
      alert('کاربران انتخاب‌شده حذف شدند (API حذف واقعی را جایگزین کنید).')
      setSelectedUsers([])
    }
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <CircularProgress />
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen text-red-500'>
        خطا در بارگذاری اعضا: {(error as Error).message}
      </div>
    )
  }

  return (
    <div className='p-2 w-full h-[calc(100vh-60px)] flex flex-col'>
      <main className='p-4 bg-white flex flex-col rounded-xl h-full'>
        <div className='min-h-[52px] flex items-center justify-center relative rounded-xl bg-[#F7F7FF] mb-4 px-2'>
          <p className='text-[16px] font-bold text-[#2a2a2a]'>جزئیات گروه</p>
          <button onClick={() => router.push('/groups')} className='absolute right-2 p-1 rounded-full hover:bg-gray-200'>
            <MdOutlineKeyboardArrowRight size={24} color='#292D32' />
          </button>
          <button onClick={() => router.push(`/groups/${groupId}?edit`)} className='absolute left-2 p-1 rounded-full hover:bg-gray-200'>
            <Suspense fallback={<div>...</div>}>
              <Image src={TrashIcon} width={24} height={24} alt='ویرایش' draggable={false} />
            </Suspense>
          </button>
        </div>

        <div className='border border-gray-200 rounded-xl p-4 flex flex-col gap-[10px] mb-4'>
          <InfoRow label='شناسه گروه' value={groupId ?? '---'} bold />
          <InfoRow label='تعداد اعضا' value={`${members.length} نفر`} bold />
        </div>

        <div className='flex flex-col flex-1 min-h-0'>
          <div className='flex justify-between items-center mb-3'>
            <h3 className='text-lg font-bold text-[#2a2a2a]'>لیست کاربران</h3>
            <div className='flex items-center gap-2'>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allUsersSelected}
                    indeterminate={someUsersSelected}
                    onChange={handleSelectAllUsers}
                    sx={{
                      color: '#1758BA',
                      '&.Mui-checked': { color: '#1758BA' },
                      '&.MuiCheckbox-indeterminate': { color: '#1758BA' },
                    }}
                  />
                }
                label='انتخاب همه'
              />
              <button
                onClick={handleDeleteSelectedUsers}
                disabled={selectedUsers.length === 0}
                className='bg-red-500 hover:bg-red-600 transition px-4 py-2 text-sm rounded-lg text-white disabled:opacity-50'>
                حذف موارد انتخابی
              </button>
            </div>
          </div>

          <div className='flex-1 overflow-y-auto border border-gray-200 rounded-xl'>
            {members.length === 0 ? (
              <p className='p-4 text-center text-gray-500'>هیچ کاربری در این گروه وجود ندارد.</p>
            ) : (
              <ul className='divide-y divide-gray-200'>
                {members.map((m) => (
                  <li key={m.introducedUserJTGroupId} className='flex items-center justify-between p-4 hover:bg-gray-50'>
                    <div className='flex items-center gap-3'>
                      <Checkbox
                        checked={selectedUsers.includes(m.introducedUserJTGroupId)}
                        onChange={(e) => handleUserCheckboxChange(m.introducedUserJTGroupId, e.target.checked)}
                        sx={{ color: '#1758BA', '&.Mui-checked': { color: '#1758BA' } }}
                      />
                      <span className='text-gray-800 font-medium'>
                        {m.userName} {m.userFamily}
                      </span>
                      <span className='text-gray-500 text-sm hidden sm:block'>
                        نام کاربری: {m.userUsername}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {hasNextPage && (
              <Box className='flex justify-center my-2'>
                {isFetchingNextPage && <CircularProgress size={24} />}
                <button onClick={() => fetchNextPage()} className='text-[#1758BA] font-semibold'>
                  بارگذاری بیشتر
                </button>
              </Box>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
