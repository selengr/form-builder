"use client";

import {useDraggable} from "@dnd-kit/core";
import {FormElement, FormElements} from "@/types/FormElements";
import useDesigner from "@/hooks/useDesigner";
import {IFormElementConstructor} from "@/types/bulider";
import {useParams} from "next/navigation";
import useActionOpenDialog from "@/hooks/useActionOpenDialog";
import useActionSelectedElement from "@/hooks/useActionSelectedElement";
import useActionOpenBottomSheet from "@/hooks/useActionOpenBottomSheet";
import Image from "next/image";
import {idGenerator} from "@/lib/idGenerator";
import {useMediaQuery} from "@mui/material";
import clsx from "clsx";

interface SidebarBtnElementProps {
  formElement: FormElement;
  disabled?: boolean;
}

function SidebarBtnElement({ formElement, disabled = false }: SidebarBtnElementProps) {
  const isMobile = useMediaQuery("(max-width:1280px)");
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
      ? questionGroups.find(group => group === selectedGroup)
      : questionGroups[questionGroups.length - 1];

    if (!targetGroupId) return;

    const newElement = FormElements[formElement.questionType].construct({
      questionId: idGenerator(),
      questionGroupId: targetGroupId,
      formId: id as any,
      title: "",
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
        "w-full flex justify-start h-[52px] items-center rounded-lg pr-2",
        "bg-[#f7f7ff] text-[#424242]",
        "hover:cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span className="bg-white rounded-xl h-[36px] w-[36px] flex justify-center items-center">
        <Image src={icon} width={24} height={24} alt="" />
      </span>
      <p className="p-2 font-bold text-right text-[14px]">{label}</p>
    </button>
  );
}

export function SidebarBtnElementDragOverlay({ formElement }: { formElement: FormElement }) {
  const { label, icon } = formElement.designerBtnElement;

  return (
    <button
      dir="rtl"
      style={{ outline: "1px dashed #1758BA" }}
      className="text-[#424242] w-full flex justify-start rounded-xl h-[52px] items-center pr-2 bg-[#fff]"
    >
      <span className="bg-[#f7f7ff] rounded-xl h-[36px] w-[36px] flex justify-center items-center">
        <Image src={icon} width={24} height={24} alt="" />
      </span>
      <p className="p-2 text-right text-[14px] font-bold">{label}</p>
    </button>
  );
}

export default SidebarBtnElement;
