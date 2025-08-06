'use client';

import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import TrashIcon from '@/../public/images/purchase-order/trashMts.svg';
import { CreateGroupDialog } from '@/app/groups/components/createGroupDialog';
import { InfoRow } from '@/components/common/infoRow';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

interface IGroup {
  id: number;
  name: string;
  description: string;
  userCount: number;
}

interface IUser {
  id: number;
  name: string;
  email: string;
}

const mockGroupsData: IGroup[] = [
  {
    id: 1,
    name: 'گروه مهندسی',
    description: 'این یک گروه برای مهندسین شرکت است که وظایف مربوط به توسعه نرم‌افزار و زیرساخت را بر عهده دارند.',
    userCount: 5,
  },
  { id: 2, name: 'گروه طراحی', description: 'توضیحات گروه طراحی.', userCount: 15 },
  {
    id: 3,
    name: 'گروه منابع انسانی',
    description: 'توضیحات گروه منابع انسانی.',
    userCount: 8,
  },
];

const mockUsersData: IUser[] = [
  { id: 101, name: 'علی احمدی', email: 'ali.ahmadi@example.com' },
  {
    id: 102,
    name: 'زهرا کریمی',
    email: 'zahra.karimi@example.com',
  },
  { id: 103, name: 'محمد حسینی', email: 'mohammad.hosseini@example.com' },
  {
    id: 104,
    name: 'فاطمه رضایی',
    email: 'fatemeh.rezaei@example.com',
  },
  { id: 105, name: 'رضا میرزایی', email: 'reza.mirzaei@example.com' },
  {
    id: 106,
    name: 'سارا نوری',
    email: 'sara.nouri@example.com',
  },
  { id: 107, name: 'امیر قاسمی', email: 'amir.ghasemi@example.com' },
];

export default function GroupDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const groupId = typeof params.id === 'string' ? parseInt(params.id, 10) : undefined;

  const [showEditGroupDialog, setShowEditGroupDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [users, setUsers] = useState<IUser[]>(mockUsersData);
  const [group, setGroup] = useState<IGroup | null>(null);

  const allUsersSelected = users.length > 0 && selectedUsers.length === users.length;
  const someUsersSelected = selectedUsers.length > 0 && selectedUsers.length < users.length;

  useEffect(() => {
    if (groupId) {
      const foundGroup = mockGroupsData.find((g) => g.id === groupId);
      setGroup(foundGroup || null);
    }
  }, [groupId]);

  useEffect(() => {
    const isEditQuery = searchParams.get('edit');
    setShowEditGroupDialog(isEditQuery !== null);
  }, [searchParams]);

  const handleEditGroupSubmit = (groupName: string) => {
    console.log('Group updated with name:', groupName);
    router.back();
  };

  const handleUserCheckboxChange = (userId: number, isChecked: boolean) => {
    setSelectedUsers((prev) => (isChecked ? [...prev, userId] : prev.filter((id) => id !== userId)));
  };

  const handleSelectAllUsers = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedUsers(event.target.checked && users.length > 0 ? users.map((user) => user.id) : []);
  };

  const handleDeleteSelectedUsers = () => {
    if (selectedUsers.length === 0) {
      alert('هیچ کاربری برای حذف انتخاب نشده است.');
      return;
    }
    if (confirm(`آیا از حذف ${selectedUsers.length} کاربر انتخاب شده مطمئن هستید؟`)) {
      setUsers((prevUsers) => prevUsers.filter((user) => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
    }
  };

  const handleDeleteSingleUser = (userId: number) => {
    if (confirm('آیا از حذف این کاربر مطمئن هستید؟')) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setSelectedUsers((prevSelected) => prevSelected.filter((id) => id !== userId));
    }
  };

  if (!group && groupId) {
    return (
      <div className='p-2 w-full h-[calc(100vh - 60px)] md:h-screen flex flex-col items-center justify-center'>
        <p className='text-gray-600'>در حال بارگذاری اطلاعات گروه...</p>
      </div>
    );
  }

  if (!group && !groupId) {
    return (
      <div className='p-2 w-full h-[calc(100vh - 60px)] md:h-screen flex flex-col items-center justify-center'>
        <p className='text-red-500 font-bold'>شناسه گروه یافت نشد یا نامعتبر است.</p>
        <button onClick={() => router.push('/groups')} className='mt-4 px-4 py-2 bg-[#1758BA] text-white rounded-lg hover:bg-[#216ee1] transition'>
          بازگشت به لیست گروه‌ها
        </button>
      </div>
    );
  }

  if (!group) return null;

  return (
    <div className='p-2 w-full h-[calc(100vh - 60px)] md:h-screen flex flex-col' draggable={false}>
      <main className='p-4 bg-white flex flex-col rounded-xl h-full'>
        <div className='min-h-[52px] flex items-center justify-center relative rounded-xl bg-[#F7F7FF] mb-4 px-2'>
          <p className='text-[16px] font-bold text-[#2a2a2a]'>جزئیات گروه: {group.name}</p>
          <button onClick={() => router.push('/groups')} className='absolute right-2 p-1 rounded-full hover:bg-gray-200' aria-label='بازگشت به لیست گروه‌ها'>
            <MdOutlineKeyboardArrowRight size={24} color='#292D32' />
          </button>
          <button onClick={() => router.push(`/groups/${groupId}?edit`)} className='absolute left-2 p-1 rounded-full hover:bg-gray-200' aria-label='ویرایش گروه'>
            <Suspense fallback={<div>...</div>}>
              <Image src={TrashIcon} width={24} height={24} alt='ویرایش' draggable={false} />
            </Suspense>
          </button>
        </div>

        <div className='mb-4'>
          <div className='border border-gray-200 rounded-xl p-4 flex flex-col gap-[10px]'>
            <InfoRow label='نام گروه' value={group.name} bold />
            <InfoRow label='تعداد اعضا' value={`${users.length} نفر`} bold />
            <InfoRow label='توضیحات' value={group.description} />
          </div>
        </div>

        <div className='flex flex-col flex-1 min-h-0'>
          <div className='flex justify-between items-center mb-3'>
            <h3 className='text-lg font-bold text-[#2a2a2a]'>لیست کاربران</h3>
            <div className='flex items-center gap-2'>
              {/* MUI Checkbox for "Select All" */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allUsersSelected}
                    indeterminate={someUsersSelected}
                    onChange={handleSelectAllUsers}
                    name='selectAllUsers'
                    sx={{
                      color: '#1758BA',
                      '&.Mui-checked': {
                        color: '#1758BA',
                      },
                      '&.MuiCheckbox-indeterminate': {
                        color: '#1758BA',
                      },
                    }}
                  />
                }
                label='انتخاب همه'
                sx={{
                  marginRight: '8px',
                  marginLeft: '0px',
                  '.MuiFormControlLabel-label': {
                    fontSize: '0.875rem',
                    color: '#4b5563',
                  },
                }}
              />
              <button
                onClick={handleDeleteSelectedUsers}
                disabled={selectedUsers.length === 0}
                className='bg-red-500 hover:bg-red-600 transition duration-200 px-4 py-2 text-sm rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed'>
                حذف موارد انتخابی
              </button>
            </div>
          </div>

          <div className='flex-1 overflow-y-auto border border-gray-200 rounded-xl'>
            {users.length === 0 ? (
              <p className='p-4 text-center text-gray-500'>هیچ کاربری در این گروه وجود ندارد.</p>
            ) : (
              <ul className='divide-y divide-gray-200'>
                {users.map((user) => (
                  <li key={user.id} className='flex items-center justify-between p-4 hover:bg-gray-50'>
                    <div className='flex items-center gap-3'>
                      {/* MUI Checkbox for individual user */}
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => handleUserCheckboxChange(user.id, e.target.checked)}
                        name={`user-${user.id}`}
                        sx={{
                          color: '#1758BA',
                          '&.Mui-checked': {
                            color: '#1758BA',
                          },
                        }}
                      />
                      <span className='text-gray-800 font-medium'>{user.name}</span>
                      <span className='text-gray-500 text-sm hidden sm:block'>{user.email}</span>
                    </div>
                    <button onClick={() => handleDeleteSingleUser(user.id)} className='p-2 rounded-full hover:bg-gray-100 transition' aria-label={`حذف کاربر ${user.name}`}>
                      <Suspense fallback={<div>...</div>}>
                        <Image src={TrashIcon} alt='حذف' width={20} height={20} draggable={false} />
                      </Suspense>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      {showEditGroupDialog && <CreateGroupDialog onClose={() => router.back()} onSubmit={handleEditGroupSubmit} />}
    </div>
  );
}
