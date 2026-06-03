'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';
// types
import Logo from "/public/images/logo/logo2.svg";
// components
import MenuList from './menuList/MenuList';
import MenuItemSkeleton from './menuItemSkeleton';
import { IUserInfoResponse } from '@actions/auth';
// import { IServerMenuItem } from '@/types/menus';

interface IProps {
  loading?: boolean;
  isAuthenticated: boolean;
  userInfo?: IUserInfoResponse | null;
}

export default function MiddleSidebar({isAuthenticated, userInfo}: IProps) {

  const menuLinks = useMemo(() => {
    if (!userInfo?.aclList) return [];

    return userInfo.aclList.filter((item) => 
      item?.type === 'menu' && 
      item?.data?.langId?.includes('acl.psya')
    );
  }, [userInfo?.aclList]);


  return (
    <div className='min-w-[400px] w-[400px] min-h-screen bg-white px-5 py-5 flex flex-col gap-5'>
      <div className='flex flex-col gap-5 items-center flex-shrink-0'>
        <Link href="/" aria-label="بازگشت به خانه" className="cursor-pointer">
          <Image
            src={Logo}
            alt="سایا لوگو"
            width={150}
            height={40}
            priority
            draggable={false}
          />
        </Link>
      </div>

      <div className='flex-1 overflow-y-auto pr-3 flex flex-col' style={{ scrollbarWidth: 'none' }}>
        {/* {!!isAuthenticated && loading && <MenuItemSkeleton />} */}
        <MenuList menuLinks={menuLinks} />
      </div>
    </div>
  );
}
