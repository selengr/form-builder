'use client';
import Image from 'next/image';
import { useMemo } from 'react';
// hooks
import { useMenu, useUserInfo } from '@/hooks';
// types
import { IServerMenuItem } from '@/types/menus';
// components
import MenuList from './menuList/MenuList';
import MenuItemSkeleton from './menuItemSkeleton';

export default function MiddleSidebar() {
  const { userInfo } = useUserInfo();
  const { menu, loading } = useMenu(userInfo);

  const menuLinks : IServerMenuItem[] | any = useMemo(() => {
    return menu?.aclList?.filter((i) => i?.type === 'menu') || [];
  }, [menu?.aclList]);

  return (
    <div className='min-w-[400px] w-[400px] min-h-screen bg-white px-5 py-5 flex flex-col gap-8'>
      <div className='flex flex-col gap-5 items-center flex-shrink-0'>
        <Image src={`/api/images?folder=logo&file=LOGO.svg`} width={150} height={38} alt='Psya-Logo' priority draggable={false} />
      </div>

      <div className='flex-1 overflow-y-auto pr-3 flex flex-col gap-4' style={{ scrollbarWidth: 'thin' }}>
        {!!userInfo && loading && <MenuItemSkeleton />}
        <MenuList menuLinks={menuLinks} />
      </div>
    </div>
  );
}
