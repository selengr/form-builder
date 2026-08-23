'use client';

import { memo, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import QuestionMenu from './QuestionPopUpMenu';
import useElements from '@/hooks/useElements';
import Image from 'next/image';
// import CodiconEye from '@/../public/images/home-page/ic_view-eye.svg';

const QuestionCardExtra = memo(function QuestionCardExtra({
  questionId,
  index,
}: {
  questionId: number;
  index: number;
}) {
  const { id } = useParams();
  const elements = useElements();
  const questionCurrentIndex = useMemo(
    () => elements.findIndex((el: any) => el.questionId === questionId),
    [elements, questionId]
  );

  return (
    <div className="flex shrink-0 flex-row gap-1 items-center">
      <button
        type="button"
        className="absolute left-14 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-[10px] hover:bg-[#F7F7FF] transition-colors"
        aria-label="منو"
      >
        <Link
          prefetch={false}
          className="flex justify-center items-center w-8 h-8"
          href={`/preview/${id}?question=${questionCurrentIndex}`}
          onClick={e => e.stopPropagation()}
        >
          <Image src="/images/home-page/ic_view-eye.svg" alt="view" height={20} width={20} unoptimized/>
        </Link>
      </button>
      <div onClick={e => e.stopPropagation()}>
        <QuestionMenu index={index} questionID={questionId} position={questionCurrentIndex} />
      </div>
    </div>
  );
});

export default QuestionCardExtra;
