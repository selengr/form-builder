/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useDraggable } from "@dnd-kit/core";
import { FormElement, FormElements } from "@/types/FormElements";
import useDesigner from "@/hooks/useDesigner";
import { IFormElementConstructor } from "@/types/bulider";
import { useParams } from "next/navigation";
import useActionOpenDialog from "@/hooks/useActionOpenDialog";
import useActionSelectedElement from "@/hooks/useActionSelectedElement";
import useActionOpenBottomSheet from "@/hooks/useActionOpenBottomSheet";
import Image from "next/image";
import { idGenerator } from "@/lib/idGenerator";
import { useResponsive } from "@/hooks/useResponsive";

function SidebarBtnElement({ formElement }: { formElement: FormElement }) {
  const isMobile = useResponsive("down", "md");
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

  return isMobile ? (
    <button
      onClick={() => {
        if (questionGroups.length) {
          const newElement = FormElements[formElement.questionType].construct({
            questionId: idGenerator(),
            questionGroupId:
              questionGroups[
                questionGroups.findIndex(
                  (group: any) => group === selectedGroup
                )
              ],
            formId: id as any,
            title: "",
            position: null,
          } as IFormElementConstructor);
          setOpenBottomSheet(false);
          setOpenDialog(true);
          setSelectedElement({ fieldElement: newElement, position: null });
        }
      }}
      className="w-full bg-[#f7f7f7] text-[#424242] flex justify-start h-[52px] items-center rounded-lg pr-2"
    >
      <span className="bg-slate-50 rounded-xl h-[32px] w-[32px] flex justify-center items-center">
        <Image src={icon} width={24} height={24} alt="" />
      </span>
      <p className="p-2 font-bold text-right text-[14px]">{label}</p>
    </button>
  ) : (
    <button
      onClick={() => {
        if (questionGroups.length) {
          const newElement = FormElements[formElement.questionType].construct({
            questionId: idGenerator(),
            questionGroupId: questionGroups[questionGroups.length - 1],
            formId: id as any,
            title: "",
            position: null,
          } as IFormElementConstructor);
          setOpenDialog(true);
          setSelectedElement({ fieldElement: newElement, position: null });
        }
      }}
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="bg-[#f7f7f7] text-[#424242] flex justify-start rounded-[16px] h-[52px] items-center pr-2"
    >
      <span className="bg-slate-50 rounded-xl h-[32px] w-[32px] flex justify-center items-center">
        <Image src={icon} width={24} height={24} alt="" />
      </span>
      <p className="p-2 font-bold text-right text-[14px]">{label}</p>
    </button>
  );
}

export function SidebarBtnElementDragOverlay({
  formElement,
}: {
  formElement: FormElement;
}) {
  const { label, icon } = formElement.designerBtnElement;

  return (
    <button
      dir="rtl"
      style={{
        outline: "1px solid #1758BA",
      }}
      className="text-[#424242] outline-1 outline-[#1758BA] w-full flex justify-start box-border rounded-[16px] h-[52px] items-center pr-2 bg-[#f7f7f7]"
    >
      <span className="bg-slate-50 rounded-xl h-[32px] w-[32px] flex justify-center items-center">
        <Image src={icon} width={24} height={24} alt="" />
      </span>
      <p className="p-2 text-right text-[14px] font-bold">{label}</p>
    </button>
  );
}

export default SidebarBtnElement;
