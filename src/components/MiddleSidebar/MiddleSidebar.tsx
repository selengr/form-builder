'use client';

import Image from 'next/image';
import { useMemo } from 'react';
// hooks
import { useMenu } from '@/hooks';
// types
import { IServerMenuItem } from '@/types/menus';
// components
import MenuList from './menuList/MenuList';
import MenuItemSkeleton from './menuItemSkeleton';
import { useUserInfoNew } from '@/hooks/useUserInfoNew';

export default function MiddleSidebar() {
  const { isAuthenticated } =  useUserInfoNew();
  const { menu, loading } = useMenu(isAuthenticated)

  const menuLinks : IServerMenuItem[] | any = useMemo(() => {
    return menu?.aclList?.filter((i) => i?.type === 'menu') || [];
  }, [menu?.aclList]);

  return (
    <div className='min-w-[400px] w-[400px] min-h-screen bg-white px-5 py-5 flex flex-col gap-5'>
      <div className='flex flex-col gap-5 items-center flex-shrink-0'>
        <Image src={`/api/images?folder=logo&file=LOGO.svg`} width={150} height={38} alt='Psya-Logo' priority draggable={false} />
      </div>

      <div className='flex-1 overflow-y-auto pr-3 flex flex-col' style={{ scrollbarWidth: 'thin' }}>
        {!!isAuthenticated && loading && <MenuItemSkeleton />}
        <MenuList menuLinks={menuLinks} />
      </div>
    </div>
  );
}
