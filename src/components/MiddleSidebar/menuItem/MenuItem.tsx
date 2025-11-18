import React, { useState } from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { IoIosArrowBack, IoIosArrowDown } from 'react-icons/io';
import {
  IMenuListProps,
  IStaticLink,
  IMenuItemData,
  IMenuItemProps,
  ISubMenuItemProps,
  IServerMenuItem,
} from '@/types/menus';

const STATIC_LINKS: IStaticLink[] = [
  { id: 7, title: 'فرم‌های عمومی', icon: 'formsMoney.svg', link: '/public-form', order: 7 },
  { id: 8, title: 'آموزش', icon: 'tour.svg', link: '/underconstruction', order: 8 },
  { id: 9, title: 'سوالات پرتکرار', icon: 'faq.svg', link: '/faq', order: 9 },
  { id: 10, title: 'قوانین و مقررات', icon: 'laws.svg', link: '/terms', order: 10 },
  { id: 11, title: 'ارتباط با ما', icon: 'contact-us.svg', link: '/underconstruction', order: 11 },
];

const SubMenuItem = ({
  id,
  href,
  icon,
  title,
  onClick,
}: ISubMenuItemProps) => (
  <div className='gap-1 bg-white transition-all w-full border-b border-[#DDE1E6] border-r-[#0066CC] border-r-4 py-4 rounded-[4px] duration-300 group pr-8' key={id} style={{ userSelect: 'none' }}>
    <Link href={href} onClick={onClick} className='w-full flex items-center justify-between transition-all duration-200'>
      <div className='flex items-center gap-2'>
        <Image src={`/api/images?folder=menu&file=${icon}`} alt='icon' width={26} height={26} priority draggable={false} className={'group-hover:rotate-6 transition-all'} />
        <p className='text-[13px] text-black font-normal'>{title}</p>
      </div>
      <IoIosArrowBack size='1rem' color='#292D32' className={'group-hover:ml-0.5 transition-all'} />
    </Link>
  </div>
);



const MenuItem = ({
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

const MenuList: React.FC<IMenuListProps> = ({ menuLinks, onItemClick }) => {
  const [expandedMenus, setExpandedMenus] = useState<Set<string | number>>(new Set());
  const serverLinks : IMenuItemData[] = menuLinks?.map((item) => ({
    id: item.id,
    title: item.text,
    icon: item.icon,
    link: item.a_attr?.href ?? '#',
    order: parseInt(item.data.order, 10),
    isStatic: false,
    langId: item.data.langId,
  })) || [];

  const staticLinks : IMenuItemData[] = STATIC_LINKS.map((item) => ({
    id: item.id,
    title: item.title,
    icon: item.icon,
    link: item.link,
    order: item.order,
    isStatic: true,
  }));

  const allLinks : IMenuItemData[] = [...serverLinks, ...staticLinks];

  const managementMaster = serverLinks.find((item) => item.langId === 'acl.psya.management.master');
  const assessmentsItem = serverLinks.find((item) => item.langId === 'acl.psya.packaging.master');

  const linksWithHierarchy = allLinks.map((item) => {
    if (managementMaster && assessmentsItem && item.id === managementMaster.id) {
      return {
        ...item,
        children: [assessmentsItem],
      };
    }
    return item;
  }).filter((item) => {
    if (managementMaster && assessmentsItem && item.id === assessmentsItem.id) {
      return false;
    }
    return true;
  });

  const sortedLinks = linksWithHierarchy.sort((a, b) => a.order - b.order);

  const handleToggle = (id: string | number) => {
    setExpandedMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <>
      {sortedLinks.map((item: any) => (
        <MenuItem
          key={item.id}
          id={item.id}
          href={item.link}
          icon={item.icon}
          title={item.title}
          onClick={onItemClick}
          isStatic={item.isStatic}
          hasChildren={!!item.children && item.children.length > 0}
          isExpanded={expandedMenus.has(item.id)}
          onToggle={() => handleToggle(item.id)}
          children={item.children}
        />
      ))}
    </>
  );
};

export default MenuList;
