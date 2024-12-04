import { memo, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import QuestionMenu from "./QuestionPopUpMenu";
import useElements from "@/hooks/useElements";
import { VscEye } from "react-icons/vsc";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [elements]
  );

  return (
    <div className="flex absolute top-[13px] left-4 flex-row gap-2 items-center">
      <Link
        className="flex justify-center items-center"
        href={`/preview/${id}?question=${questionCurrentIndex}`}
      >
        <VscEye color="#1758BA" size="1.5rem" />
      </Link>
      <QuestionMenu
        index={index}
        questionID={questionId}
        position={questionCurrentIndex}
      />
    </div>
  );
});

export default QuestionCardExtra;
