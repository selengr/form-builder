import React from 'react';
import Link from 'next/link';
import { MenuIcon } from './MenuIcon';
import { IoIosArrowBack, IoIosArrowDown } from 'react-icons/io';
// type
import { IMenuItemProps } from '@/types/menus';
import SubMenuItem from './subMenu/SubMenuItem'

export const MenuItem = React.memo(
  ({
    id,
    href,
    icon,
    title,
    onClick,
    hasChildren = false,
    isExpanded = false,
    onToggle,
    children,
  }: IMenuItemProps) => {
    const iconPath = `/api/images?folder=menu&file=${icon}`;

    return (
      <div className="w-full">
        <div
          className="gap-1 w-full py-2 rounded-sm duration-300 group border-b border-[#DDE1E6]"
          style={{ userSelect: 'none' }}
        >
          {hasChildren ? (
            <button
              onClick={onToggle}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <MenuIcon src={iconPath} />
                <p className="text-[14px] text-black font-bold">{title}</p>
              </div>

              {isExpanded ? (
                <IoIosArrowDown size="1.3rem" color="#292D32" />
              ) : (
                <IoIosArrowBack
                  size="1.3rem"
                  color="#292D32"
                  className="group-hover:ml-0.5 transition-all"
                />
              )}
            </button>
          ) : (
            <Link
              href={href}
              onClick={onClick}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <MenuIcon src={iconPath} />
                <p className="text-[14px] text-black font-bold">{title}</p>
              </div>

              <IoIosArrowBack
                size="1.3rem"
                color="#292D32"
                className="group-hover:ml-0.5 transition-all"
              />
            </Link>
          )}
        </div>

        {hasChildren && isExpanded && children && (
          <div className="bg-[#F8F9FA]">
            {children.map((child) => (
              <SubMenuItem
                key={child.id}
                id={child.id}
                href={child.link}
                icon={child.icon}
                title={child.title}
                onClick={onClick}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);
