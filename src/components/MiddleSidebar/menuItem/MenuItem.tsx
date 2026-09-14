'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MenuIcon } from './MenuIcon';
import SubMenuItem from './subMenu/SubMenuItem';
import { IMenuItemProps } from '@/types/menus';

const expandSpring = { type: 'spring' as const, stiffness: 420, damping: 38, mass: 0.8 };

export const MenuItem = React.memo(
  ({
    href,
    icon,
    title,
    onClick,
    hasChildren = false,
    isExpanded = false,
    onToggle,
    children,
  }: IMenuItemProps) => {
    const pathname = usePathname();
    const reduceMotion = useReducedMotion();
    const iconPath = `/api/images?folder=menu&file=${icon}`;

    const isActive =
      pathname.includes(href) || children?.some((child) => pathname === child.link);

    return (
      <div className="w-full">
        <div
          style={{ userSelect: 'none' }}
          className={`
            group relative w-full rounded-xl pt-3 overflow-hidden
            transition-colors duration-200 ease-out
            ${isActive ? 'bg-[#F7F9FC]' : 'hover:bg-[#F7F9FC] active:bg-[#EEF2F6]'}
          `}>
          <div className="border-b border-[#DDE1E6]">
            <div
              className={`
                absolute right-0 top-0 h-full w-[4px] rounded-l-full
                transition-opacity duration-200
                ${isActive && !isExpanded ? 'bg-[#2CDFC9] opacity-100' : 'opacity-0'}
              `}
            />

            {hasChildren ? (
              <button
                onClick={onToggle}
                className={`
                  w-full flex items-center justify-between px-3 py-2
                  active:scale-[0.98] transition-transform duration-150
                  ${isActive ? 'translate-x-[4px]' : ''}
                `}>
                <div className="flex items-center gap-3">
                  <div className={`transition-transform duration-200 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}>
                    <MenuIcon src={iconPath} size={23} />
                  </div>
                  <p className="text-[13px] sm:text-[14px] font-semibold sm:font-bold text-[#1F2937]">
                    {title}
                  </p>
                </div>

                <motion.span
                  animate={{ rotate: isExpanded ? -90 : 0 }}
                  transition={reduceMotion ? { duration: 0 } : expandSpring}
                  className="inline-flex">
                  <IoIosArrowBack size="1.3rem" color="#292D32" />
                </motion.span>
              </button>
            ) : (
              <Link
                href={href}
                onClick={onClick}
                className={`
                  w-full flex items-center justify-between px-3 py-2
                  active:scale-[0.98] transition-transform duration-150
                  ${isActive ? 'translate-x-[4px]' : ''}
                `}>
                <div className="flex items-center gap-2">
                  <div className={`transition-transform duration-200 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}>
                    <MenuIcon src={iconPath} size={23} />
                  </div>
                  <p className="text-[13px] sm:text-[14px] font-semibold sm:font-bold text-[#1F2937]">
                    {title}
                  </p>
                </div>

                <IoIosArrowBack
                  size="1.1rem"
                  color={isActive ? '#0066CC' : '#4B5563'}
                  className="transition-transform duration-200 group-hover:-translate-x-1"
                />
              </Link>
            )}
          </div>

          <AnimatePresence initial={false}>
            {hasChildren && isExpanded && (
              <motion.div
                key="submenu"
                initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                transition={reduceMotion ? { duration: 0 } : expandSpring}
                className="overflow-hidden bg-[#F8F9FA]">
                <div className="flex flex-col">
                  {children?.map((child) => (
                    <SubMenuItem
                      key={child.id}
                      {...child}
                      href={child.link}
                      onClick={onClick}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  },
);
