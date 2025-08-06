'use client';
import Image from 'next/image';
import { CgClose } from 'react-icons/cg';
import React, { useMemo, useState } from 'react';
import { Drawer, IconButton } from '@mui/material';

// public
import Logo from '@/../public/images/home-page/psya-logo.svg';
import MenuIcon from '@/../public/images/home-page/menu/ic_menu.svg';
// hooks
import { useMenu, useUserInfo } from '@/hooks';
// view
import MenuList from '../menuItem/MenuItem';
import MenuItemSkeleton from '../menuItemSkeleton';

const MobileMenu: React.FC = () => {
  const { userInfo } = useUserInfo();
  const [open, setOpen] = useState(false);
  const { menu, loading } = useMenu(userInfo);
  const [isRotated, setIsRotated] = useState(false);

  const menuLinks = useMemo(() => {
    return menu?.aclList?.filter((i) => i.type === 'menu') || [];
  }, [menu]);

  const toggleDrawer = () => {
    setIsRotated((prev) => !prev);
    setTimeout(() => {
      setOpen((prev) => !prev);
    }, 300);
  };

  return (
    <div className={'z-50'}>
      <IconButton edge='start' color='inherit' aria-label='menu' onClick={toggleDrawer}>
        <Image src={MenuIcon} alt='icon' width={32} height={32} priority draggable={false} />
      </IconButton>

      <Drawer anchor='left' open={open} onClose={toggleDrawer}>
        <div className='max-w-[400px] min-w-[370px] min-h-screen bg-white px-5 py-5 flex flex-col gap-8 overflow-y-auto' style={{ scrollbarWidth: 'thin' }}>
          <div className='w-full flex flex-col gap-10 items-start'>
            <div className='flex flex-row justify-between w-full items-center'>
              <Image src={Logo} width={111} height={38} alt='Psya-Logo' priority draggable={false} />
              <IconButton edge='end'>
                <CgClose
                  color='#404040'
                  width={25}
                  height={20}
                  size='1.5rem'
                  onClick={toggleDrawer}
                  style={{
                    transition: 'transform 0.3s',
                    transform: isRotated ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </IconButton>
            </div>
            <div className='flex flex-col items-start w-full gap-5'>
              {!!userInfo && loading && <MenuItemSkeleton />}
              <MenuList menuLinks={menuLinks} onItemClick={() => setOpen(false)} />
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default MobileMenu;
