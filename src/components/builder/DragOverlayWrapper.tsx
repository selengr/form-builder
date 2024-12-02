import { useState } from "react";
import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import { SidebarBtnElementDragOverlay } from "./SidebarBtnElement";
import { ElementsType, FormElements } from "@/types/FormElements";
import useElements from "@/hooks/useElements";

function DragOverlayWrapper() {
  const elements = useElements();
  const [draggedItem, setDraggedItem] = useState<Active | null | undefined>(
    null
  );

  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
    onDragCancel: (event) => {
      const designerBtnDragEnd =
        event?.active?.data?.current?.isQuestionElement;
      if (designerBtnDragEnd) {
        setDraggedItem(undefined);
      } else {
        setDraggedItem(null);
      }
    },
    onDragEnd: (event) => {
      const designerBtnDragEnd =
        event?.active?.data?.current?.isQuestionElement;
      if (designerBtnDragEnd) {
        setDraggedItem(undefined);
      } else {
        setDraggedItem(null);
      }
    },
  });

  let node;
  let isSidebarBtnElement;
  let isQuestionElement;

  if (draggedItem) {
    node = <div>No drag overlay</div>;
    isSidebarBtnElement = draggedItem?.data?.current?.isSidebarBtnElement;
    isQuestionElement = draggedItem?.data?.current?.isQuestionElement;
  }

  if (isSidebarBtnElement) {
    const type = draggedItem?.data?.current?.type as ElementsType;
    node = <SidebarBtnElementDragOverlay formElement={FormElements[type]} />;
  } else if (isQuestionElement) {
    const elementId = draggedItem?.data?.current?.question?.questionId;
    const element = elements.find((el) => el.questionId === elementId);

    if (!element) node = <div>فیلد یافت نشد!</div>;
    else {
      const DesignerElementComponent =
        FormElements[element.questionType as ElementsType].designerComponent;

      node = (
        <div
          dir="rtl"
          className="flex justify-start box-border items-center outline outline-1 outline-[#1758BA] rounded-xl bg-[#f7f7f7] h-[65px] w-full opacity-90 px-2"
          style={{ pointerEvents: "none" }}
        >
          <DesignerElementComponent elementInstance={element} />
        </div>
      );
    }
  }

  return (
    <DragOverlay
      dropAnimation={
        draggedItem === undefined
          ? {
              duration: 250,
              easing: "ease-in-out",
            }
          : null
      }
    >
      {draggedItem ? node : null}
    </DragOverlay>
  );
}

export default DragOverlayWrapper;
