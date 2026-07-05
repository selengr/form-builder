'use client';

import { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RxDragHandleDots2 } from 'react-icons/rx';

interface LogicSortableItemProps {
  id: string;
  disabled?: boolean;
  children: ReactNode;
}

export default function LogicSortableItem({
  id,
  disabled = false,
  children,
}: LogicSortableItemProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-stretch gap-2 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        disabled={disabled}
        className="flex items-center justify-center w-8 shrink-0 text-[#1758BA] cursor-grab active:cursor-grabbing disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="جابجایی"
      >
        <RxDragHandleDots2 size={20} />
      </button>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
