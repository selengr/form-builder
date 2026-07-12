'use client';

import { useDraggable } from '@dnd-kit/core';
import Image from 'next/image';
import clsx from 'clsx';
import { useMediaQuery } from '@mui/material';

export type LogicSidebarType = 'calculator' | 'condition';

interface SidebarBtnLogicProps {
  title: string;
  icon: string;
  logicType: LogicSidebarType;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}

function SidebarBtnLogicContent({ title, icon }: { title: string; icon: string }) {
  return (
    <>
      <span className="bg-white rounded-[10px] h-9 w-9 flex justify-center items-center shrink-0">
        <Image src={icon} width={22} height={22} alt="" />
      </span>

      <p className="flex-1 text-right pr-1 text-[#161616] text-sm">{title}</p>
    </>
  );
}

export default function SidebarBtnLogic({
  title,
  icon,
  logicType,
  onClick,
  active = false,
  disabled = false,
}: SidebarBtnLogicProps) {
  const isMobile = useMediaQuery('(max-width:1280px)');

  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: `logic-btn-${logicType}`,
    data: {
      logicType,
      isSidebarBtnLogic: true,
    },
    disabled: disabled || isMobile,
  });

  const buttonClassName = clsx(
    'w-full flex items-center gap-3 h-[52px] rounded-xl px-2 flex-row-reverse',
    'bg-[#F7F7FF] border shadow-sm transition-colors',
    !isMobile && 'hover:cursor-grab active:cursor-grabbing',
    active ? 'border-[#1758BA]' : 'border-[#F7F7FF] hover:border-[#2CDFC9]',
    disabled && 'opacity-50 cursor-not-allowed',
    isDragging && 'opacity-40',
  );

  if (isMobile) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={buttonClassName}
      >
        <SidebarBtnLogicContent title={title} icon={icon} />
      </button>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={clsx('touch-none', disabled && 'pointer-events-none')}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={buttonClassName}
      >
        <SidebarBtnLogicContent title={title} icon={icon} />
      </button>
    </div>
  );
}

export function SidebarBtnLogicDragOverlay({
  title,
  icon,
}: {
  title: string;
  icon: string;
}) {
  return (
    <button
      dir="rtl"
      style={{ outline: '1px dashed #1758BA', width: 316 }}
      className="flex items-center gap-3 h-[52px] rounded-xl px-2 flex-row-reverse bg-[#F7F7FF] shadow-md"
    >
      <span className="bg-white rounded-[10px] h-9 w-9 flex justify-center items-center shrink-0">
        <Image src={icon} width={22} height={22} alt="" />
      </span>

      <p className="flex-1 text-right pr-1 text-[#161616] text-sm">
        {title}
      </p>
    </button>
  );
}
