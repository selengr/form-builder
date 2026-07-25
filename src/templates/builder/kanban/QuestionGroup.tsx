'use client';

import { memo, useMemo } from 'react';
import Image from 'next/image';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import useMediaQuery from '@mui/material/useMediaQuery';
import QuestionCard from './QuestionCard';
import useActionOpenBottomSheet from '@/hooks/useActionOpenBottomSheet';
import useActionDesigner from '@/hooks/useActionDesigner';
import { FormElementInstance } from '@/types/FormElements';
import emptyIllustration from '@/../public/images/home-page/notfound-meh.svg';

type Props = {
  group: number;
  questions: FormElementInstance[];
  disabled?: boolean;
};

const QuestionGroup = memo(function QuestionGroup({
  group,
  questions = [],
  disabled = false,
}: Props) {
  const isMobile = useMediaQuery('(max-width:1280px)');
  const setOpenBottomSheet = useActionOpenBottomSheet();
  const { setSelectedGroup } = useActionDesigner();

  const safeQuestions = Array.isArray(questions) ? questions : [];

  const questionsIds = useMemo(() => {
    return safeQuestions.map((question) => question?.questionId);
  }, [safeQuestions]);

  const droppable = useDroppable({
    id: group,
    data: {
      type: 'question-group',
      group,
    },
  });

  const handleAddQuestion = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      setSelectedGroup(group);
      setOpenBottomSheet(true);
    }
  };

  const dropZoneText = isMobile
    ? 'سوال مورد نظر را از اینجا اضافه کنید'
    : 'سوال خود را از پنل کناری به اینجا بکشید';

  const isEmpty = safeQuestions.length === 0;

  return (
     <div
     dir='rtl'
      ref={droppable.setNodeRef}
      className={`flex flex-col w-full h-full min-h-0 rounded-2xl border border-[#DDE1E6] bg-[#F8FAFC] overflow-hidden ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {isEmpty && !isMobile && (
        <div className="flex flex-col items-center justify-center py-16 px-6 h-[80%]">
          <Image
            src={emptyIllustration}
            alt=""
            width={350}
            height={220}
            className="opacity-80"
            draggable={false}
          />
          <p className="text-[#6F6F6F] text-[14px] md:text-[15px] font-semibold md:font-bold text-center">{dropZoneText}</p>
        </div>
      )}

      {safeQuestions.length > 0 && (
         <div
          className="flex flex-col w-full flex-1 min-h-0 overflow-y-auto px-3 pt-3 gap-2"
          style={{ scrollbarWidth: 'thin' }}
        >
          <SortableContext items={questionsIds} strategy={verticalListSortingStrategy}>
            {safeQuestions.map((question, index) => (
              <QuestionCard key={questionsIds[index]} question={question} index={index} />
            ))}
          </SortableContext>
        </div>
      )}

      {(isMobile || safeQuestions.length > 0) && (
        <div
          className={`mx-3 mb-3 mt-2 flex items-center justify-center rounded-xl border border-dashed border-[#DDE1E6] bg-transparent min-h-[56px] ${
            isMobile && !disabled ? 'cursor-pointer' : ''
          }`}
          onClick={isMobile ? handleAddQuestion : undefined}
        >
          <p
            className={`p-3 text-[#6F6F6F] text-center text-sm font-medium ${
              isMobile && !disabled ? 'cursor-pointer' : ''
            }`}
          >
            {dropZoneText}
          </p>
        </div>
      )}
    </div>
  );
});

export default QuestionGroup;
