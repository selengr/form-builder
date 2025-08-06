'use client';
import { memo, useMemo } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import useMediaQuery from '@mui/material/useMediaQuery';

import QuestionCard from './QuestionCard';

import useActionOpenBottomSheet from '@/hooks/useActionOpenBottomSheet';
import useActionDesigner from '@/hooks/useActionDesigner';

import { FormElementInstance } from '@/types/FormElements';

type Props = {
  group: number;
  questions: FormElementInstance[];
  disabled?: boolean;
};

const QuestionGroup = memo(function QuestionGroup({ group, questions = [], disabled = false }: Props) {
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

  return (
    <div
      ref={droppable.setNodeRef}
      className={`flex flex-col w-full rounded-xl items-center justify-center bg-[#f7f7f7] ${
        safeQuestions.length ? '' : 'border-[1px] border-[#1758BA]'
      } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {safeQuestions.length > 0 && (
        <div className='flex flex-col w-full min-h-[60px] px-2 pt-2 gap-4'>
          <SortableContext items={questionsIds} strategy={verticalListSortingStrategy}>
            {safeQuestions.map((question, index) => (
              <QuestionCard key={questionsIds[index]} question={question} />
            ))}
          </SortableContext>
        </div>
      )}

      <div className='flex flex-row-reverse items-center justify-center py-2 w-full'>
        {isMobile ? (
          <p onClick={handleAddQuestion} className='p-2 text-[#424242] text-center text-sm font-bold cursor-pointer'>
            برای افزودن سوال این قسمت را لمس کنید
          </p>
        ) : (
          <p className='p-2 text-[#424242] text-center font-bold'>نوع سوال را از فهرست کناری نگه داشته و بکشید</p>
        )}
        {/*<GroupPopUpMenu groupId={group} />*/}
      </div>
    </div>
  );
});

export default QuestionGroup;
