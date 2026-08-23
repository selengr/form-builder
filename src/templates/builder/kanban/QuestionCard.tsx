'use client';

import { memo } from 'react';
import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ElementsType, FormElementInstance, FormElements } from '#t/FormElements';
import QuestionCardExtra from './QuestionCardExtra';


function QuestionTypeIcon({ questionType }: { questionType: ElementsType }) {
  const icon = FormElements[questionType]?.designerBtnElement?.icon;
  if (!icon) return null;

  return (
    <span className="rounded-[10px] h-9 w-9 flex justify-center items-center shrink-0 bg-[#F7F7FF]">
      <Image src={icon} width={22} height={22} alt="" unoptimized/>
    </span>
  );
}

interface QuestionCardContentProps {
  question: FormElementInstance;
  index: number;
  isDragging?: boolean;
  isOverlay?: boolean;
  showActions?: boolean;
}

export function QuestionCardContent({
  question,
  index,
  isDragging = false,
  isOverlay = false,
  showActions = true,
}: QuestionCardContentProps) {
  const questionType = question.questionType as ElementsType;
  const DesignerElement = FormElements[questionType].designerComponent;
  const persianNumber = (index + 1).toLocaleString('fa-IR');

  return (
    <div
      dir="rtl"
      className={`flex items-center gap-2 h-[72px] w-full py-3 pl-3 pr-2 border rounded-xl bg-white ${
        isOverlay
          ? 'border-[#E8E8E8] shadow-lg opacity-95'
          : isDragging
            ? 'border-[#CCC] opacity-50'
            : 'border-[#E8E8E8] opacity-100'
      }`}
      style={isOverlay ? { pointerEvents: 'none' } : undefined}
    >

<div
      className="flex flex-col items-center justify-center gap-[3px] shrink-0 py-1 pl-2 -mr-[.55rem]"
      aria-hidden
    >
       <Image src={'/images/home-page/menu.svg'} width={12} height={12} alt="" unoptimized/>
    </div>

      <span className="text-[#9EA3AC] font-medium text-[13px] w-5 text-center shrink-0">
        {persianNumber}
      </span>

      <QuestionTypeIcon questionType={questionType} />

      <div className="flex-1 min-w-0 overflow-hidden">
        <DesignerElement elementInstance={question} />
      </div>

      {showActions && !isOverlay && (
        <QuestionCardExtra questionId={question.questionId} index={index} />
      )}
    </div>
  );
}

const QuestionCard = memo(function QuestionCard({
  question,
  index,
}: {
  question: FormElementInstance;
  index: number;
}) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: question.questionId,
    data: {
      type: 'question',
      question,
      isQuestionElement: true,
    },
  });

  question.position = index;

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (question?.temp) {
    return (
      <div
        className="flex items-center opacity-30 h-[72px] border border-[#1758BA] rounded-xl bg-white"
        style={style}
      />
    );
  }

  return (
    <div className="relative w-full" style={style}>
      <div ref={setNodeRef} {...attributes} {...listeners}>
        <QuestionCardContent question={question} index={index} isDragging={isDragging} />
      </div>
    </div>
  );
});

export default QuestionCard;
