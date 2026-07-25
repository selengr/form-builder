'use client';

import { useDraggable } from '@dnd-kit/core';
import Image from 'next/image';
import clsx from 'clsx';
import { useMediaQuery } from '@mui/material';
import { useParams } from 'next/navigation';
import { FormElement, FormElements } from '@/types/FormElements';
import { IFormElementConstructor } from '@/types/bulider';
import { idGenerator } from '@/lib/idGenerator';
import useDesigner from '@/hooks/useDesigner';
import useActionOpenDialog from '@/hooks/useActionOpenDialog';
import useActionSelectedElement from '@/hooks/useActionSelectedElement';
import useActionOpenBottomSheet from '@/hooks/useActionOpenBottomSheet';

interface SidebarBtnElementProps {
  formElement: FormElement;
  disabled?: boolean;
}

function SidebarBtnElement({ formElement, disabled = false }: SidebarBtnElementProps) {
  const isMobile = useMediaQuery('(max-width:1280px)');
  const setOpenDialog = useActionOpenDialog();
  const setSelectedElement = useActionSelectedElement();
  const setOpenBottomSheet = useActionOpenBottomSheet();
  const { questionGroups, selectedGroup } = useDesigner();
  const { id } = useParams();
  const { label, icon } = formElement.designerBtnElement;

  const draggable = useDraggable({
    id: `designer-btn-${formElement.questionType}`,
    data: {
      type: formElement.questionType,
      isSidebarBtnElement: true,
    },
  });

  const handleClick = () => {
    if (disabled || !questionGroups.length) return;

    const targetGroupId = isMobile
      ? questionGroups.find((group) => group === selectedGroup)
      : questionGroups[questionGroups.length - 1];

    if (!targetGroupId) return;

    const newElement = FormElements[formElement.questionType].construct({
      questionId: idGenerator(),
      questionGroupId: targetGroupId,
      formId: id as any,
      title: '',
      position: null,
    } as IFormElementConstructor);

    if (isMobile) setOpenBottomSheet(false);
    setOpenDialog(true);
    setSelectedElement({ fieldElement: newElement, position: null });
  };

  return (
    <button
      onClick={handleClick}
      ref={!isMobile ? draggable.setNodeRef : undefined}
      {...(!isMobile ? draggable.listeners : {})}
      {...(!isMobile ? draggable.attributes : {})}
      disabled={disabled}
      className={clsx(
        'w-full flex items-center gap-3 h-[52px] rounded-xl px-2 flex-row-reverse',
        'bg-[#F7F7FF] border border-[#F7F7FF] shadow-sm text-[#424242]',
        'hover:cursor-grab active:cursor-grabbing hover:border-[#2CDFC9]',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {icon && (
        <span className="bg-white rounded-[10px] h-9 w-9 flex justify-center items-center shrink-0">
          <Image src={icon} width={22} height={22} alt="" />
        </span>
      )}
      <p className="text-right pr-1 text-[#161616] text-[13px] md:text-sm font-normal flex-1">{label}</p>
    </button>
  );
}

export function SidebarBtnElementDragOverlay({ formElement }: { formElement: FormElement }) {
  const { label, icon } = formElement.designerBtnElement;

  return (
    <button
      dir="rtl"
      style={{ outline: '1px dashed #1758BA' }}
      className="text-[#424242] flex-row-reverse w-full flex items-center gap-3 rounded-xl h-[52px] px-2 bg-[#F7F7FF] shadow-md"
    >
      {icon && (
        <span className="bg-white rounded-[10px] h-9 w-9 flex justify-center items-center shrink-0">
          <Image src={icon} width={22} height={22} alt="" />
        </span>
      )}
      <p className="text-right pr-1 text-[#161616] text-[13px] md:text-sm font-normal flex-1">{label}</p>
    </button>
  );
}

export default SidebarBtnElement;
