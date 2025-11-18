import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IoIosArrowBack, IoIosArrowDown } from 'react-icons/io';
// types
import {
  IMenuItemProps,
} from '@/types/menus';
// constants
import SubMenuItem from './subMenu/SubMenuItem';

export const MenuItem = ({
  id,
  href,
  icon,
  title,
  onClick,
  isStatic = false,
  hasChildren = false,
  isExpanded = false,
  onToggle,
  children,
}: IMenuItemProps) => (
  <div className='w-full' key={id}>
    <div className="gap-1 w-full  py-2 rounded-sm duration-300 group border-b border-[#DDE1E6]" style={{ userSelect: 'none' }}>
      {hasChildren ? (
        <button onClick={onToggle} className='w-full flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Image src={`/api/images?folder=menu&file=${icon}`} alt='icon' width={32} height={32} priority draggable={false} className={'group-hover:rotate-6 transition-all'} />
            <p className='text-[14px] text-black font-bold'>{title}</p>
          </div>
          {isExpanded && hasChildren ? (
            <IoIosArrowDown size='1.3rem' color='#292D32' className={'transition-all'} />
          ) : (
            <IoIosArrowBack size='1.3rem' color='#292D32' className={'group-hover:ml-0.5 transition-all'} />
          )}
        </button>
      ) : (
        <Link href={href} onClick={onClick} className='w-full flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Image src={`/api/images?folder=menu&file=${icon}`} alt='icon' width={32} height={32} priority draggable={false} className={'group-hover:rotate-6 transition-all'} />
            <p className='text-[14px] text-black font-bold'>{title}</p>
          </div>
          <IoIosArrowBack size='1.3rem' color='#292D32' className={'group-hover:ml-0.5 transition-all'} />
        </Link>
      )}
    </div>
    {hasChildren && isExpanded && children && (
      <div className='bg-[#F8F9FA]'>
        {children.map((child) => (
          <SubMenuItem key={child.id} id={child.id} href={child.link} icon={child.icon} title={child.title} onClick={onClick} />
        ))}
      </div>
    )}
  </div>
);