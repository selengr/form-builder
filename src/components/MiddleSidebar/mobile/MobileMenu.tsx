'use client';

import Image from 'next/image';
import { CgClose } from 'react-icons/cg';
import React, { useEffect, useMemo, useState } from 'react';
import { IconButton } from '@mui/material';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Logo from '@/../public/images/home-page/psya-logo.svg';
import MenuIcon from '@/../public/images/home-page/menu/ic_menu.svg';
import MenuList from '../menuList/MenuList';
import { useUserInfoContext } from '@/context/UserInfoContext';

const panelSpring = { type: 'spring' as const, stiffness: 380, damping: 36, mass: 0.85 };
const backdropEase = { duration: 0.22, ease: [0.32, 0.72, 0, 1] as const };

const MobileMenu: React.FC = () => {
  const { userInfo } = useUserInfoContext();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const menuLinks = useMemo(() => {
    if (!userInfo?.aclList) return [];

    return userInfo.aclList.filter(
      (item) => item?.type === 'menu' && item?.data?.langId?.includes('acl.psya'),
    );
  }, [userInfo?.aclList]);

  const toggleDrawer = () => setOpen((prev) => !prev);
  const closeDrawer = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="z-50">
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer}
        className="active:scale-95 transition-transform">
        <Image src={MenuIcon} alt="icon" width={32} height={32} priority draggable={false} />
      </IconButton>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="بستن منو"
              className="fixed inset-0 z-[1300] bg-black/40 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : backdropEase}
              onClick={closeDrawer}
            />

            <motion.aside
              className="fixed top-0 left-0 z-[1301] flex h-[100dvh] w-[78vw] max-w-[340px] flex-col gap-8 overflow-y-auto bg-white px-4 py-5 shadow-[8px_0_32px_rgba(0,0,0,0.12)]"
              style={{ scrollbarWidth: 'thin' }}
              initial={reduceMotion ? false : { x: '-105%' }}
              animate={{ x: 0 }}
              exit={reduceMotion ? undefined : { x: '-105%' }}
              transition={reduceMotion ? { duration: 0 } : panelSpring}
              drag={reduceMotion ? false : 'x'}
              dragConstraints={{ left: -320, right: 0 }}
              dragElastic={0.08}
              onDragEnd={(_, info) => {
                if (info.offset.x < -72 || info.velocity.x < -450) {
                  closeDrawer();
                }
              }}>
              <div className="flex w-full flex-col items-start gap-10">
                <div className="flex w-full flex-row items-center justify-between">
                  <Image src={Logo} width={111} height={38} alt="Psya-Logo" priority draggable={false} />
                  <IconButton edge="end" onClick={closeDrawer} aria-label="بستن" className="active:scale-90">
                    <motion.span
                      initial={reduceMotion ? false : { rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={panelSpring}>
                      <CgClose color="#404040" size="1.5rem" />
                    </motion.span>
                  </IconButton>
                </div>

                <div className="flex w-full flex-col items-start">
                  <MenuList menuLinks={menuLinks} onItemClick={closeDrawer} />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMenu;
