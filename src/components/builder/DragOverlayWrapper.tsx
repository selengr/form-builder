'use client';
import { useState } from 'react';
import { Active, DragOverlay, useDndMonitor } from '@dnd-kit/core';
import { SidebarBtnElementDragOverlay } from './SidebarBtnElement';
import { SidebarBtnLogicDragOverlay } from './SidebarBtnLogic';
import { ElementsType, FormElements } from '@/types/FormElements';
import useElements from '@/hooks/useElements';
import { QuestionCardContent } from '@/templates/builder/kanban/QuestionCard';

function DragOverlayWrapper() {
  const elements = useElements();
  const [draggedItem, setDraggedItem] = useState<Active | null | undefined>(null);

  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
    onDragCancel: (event) => {
      const designerBtnDragEnd = event?.active?.data?.current?.isQuestionElement;
      if (designerBtnDragEnd) {
        setDraggedItem(undefined);
      } else {
        setDraggedItem(null);
      }
    },
    onDragEnd: (event) => {
      const designerBtnDragEnd = event?.active?.data?.current?.isQuestionElement;
      if (designerBtnDragEnd) {
        setDraggedItem(undefined);
      } else {
        setDraggedItem(null);
      }
    },
  });

  let node;
  let isSidebarBtnElement;
  let isSidebarBtnLogic;
  let isQuestionElement;

  if (draggedItem) {
    node = <div>No drag overlay</div>;
    isSidebarBtnElement = draggedItem?.data?.current?.isSidebarBtnElement;
    isSidebarBtnLogic = draggedItem?.data?.current?.isSidebarBtnLogic;
    isQuestionElement = draggedItem?.data?.current?.isQuestionElement;
  }

  if (isSidebarBtnElement) {
    const type = draggedItem?.data?.current?.type as ElementsType;
    node = <SidebarBtnElementDragOverlay formElement={FormElements[type]} />;
  } else if (isSidebarBtnLogic) {
    const logicType = draggedItem?.data?.current?.logicType as 'calculator' | 'condition';
    const logicMeta =
      logicType === 'calculator'
        ? { title: 'محاسبه‌گر جدید', icon: '/images/calc/ic_calculator.svg' }
        : { title: 'شرط جدید', icon: '/images/calc/ic_condition.svg' };
    node = <SidebarBtnLogicDragOverlay title={logicMeta.title} icon={logicMeta.icon} />;
  } else if (isQuestionElement) {
    const elementId = draggedItem?.data?.current?.question?.questionId;
    const elementIndex = elements.findIndex((el) => el.questionId === elementId);
    const element = elements.find((el) => el.questionId === elementId);

    if (!element) node = <div>فیلد یافت نشد!</div>;
    else {
      node = (
        <QuestionCardContent
          question={element}
          index={elementIndex >= 0 ? elementIndex : 0}
          isOverlay={false}
          showActions={true}
        />
      );
    }
  }

  return (
    <DragOverlay
      dropAnimation={
        draggedItem === undefined
          ? {
              duration: 250,
              easing: 'ease-in-out',
            }
          : null
      }>
      {draggedItem ? node : null}
    </DragOverlay>
  );
}

export default DragOverlayWrapper;
