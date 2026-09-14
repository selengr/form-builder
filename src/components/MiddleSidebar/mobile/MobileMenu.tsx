'use client';
import Image from 'next/image';
import { CgClose } from 'react-icons/cg';
import React, { useMemo, useState } from 'react';
import { Drawer, IconButton } from '@mui/material';

// public
import Logo from '@/../public/images/home-page/psya-logo.svg';
import MenuIcon from '@/../public/images/home-page/menu/ic_menu.svg';
// view
import MenuList from '../menuList/MenuList';
// context
import { useUserInfoContext } from '@/context/UserInfoContext';

const IOS_EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';

const MobileMenu: React.FC = () => {
  const { userInfo } = useUserInfoContext();
  const [open, setOpen] = useState<boolean>(false);

  const menuLinks = useMemo(() => {
    if (!userInfo?.aclList) return [];

    return userInfo.aclList.filter(
      (item) => item?.type === 'menu' && item?.data?.langId?.includes('acl.psya'),
    );
  }, [userInfo?.aclList]);

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="z-50">
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer}
        sx={{
          transition: `transform 200ms ${IOS_EASE}`,
          '&:active': { transform: 'scale(0.92)' },
        }}>
        <Image src={MenuIcon} alt="icon" width={32} height={32} priority draggable={false} />
      </IconButton>

      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        transitionDuration={{ enter: 340, exit: 280 }}
        SlideProps={{
          easing: { enter: IOS_EASE, exit: IOS_EASE },
        }}
        ModalProps={{ keepMounted: true }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(15, 23, 42, 0.28)',
              transition: `opacity 280ms ${IOS_EASE} !important`,
            },
          },
          paper: {
            sx: {
              boxShadow: '0 12px 40px rgba(15, 23, 42, 0.18)',
            },
          },
        }}>
        <div
          className="w-[75vw] max-w-[340px] min-h-screen bg-white px-4 py-5 flex flex-col gap-8 overflow-y-auto"
          style={{ scrollbarWidth: 'thin' }}>
          <div className="w-full flex flex-col gap-10 items-start">
            <div className="flex flex-row justify-between w-full items-center">
              <Image src={Logo} width={111} height={38} alt="Psya-Logo" priority draggable={false} />
              <IconButton
                edge="end"
                onClick={toggleDrawer}
                aria-label="بستن منو"
                sx={{
                  transition: `transform 280ms ${IOS_EASE}`,
                  '&:active': { transform: 'scale(0.9)' },
                }}>
                <CgClose color="#404040" size="1.5rem" />
              </IconButton>
            </div>
            <div className="flex flex-col items-start w-full">
              <MenuList menuLinks={menuLinks} onItemClick={() => setOpen(false)} />
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default MobileMenu;
