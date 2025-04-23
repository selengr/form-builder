import { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ElementsType,
  FormElementInstance,
  FormElements,
} from "../../../types/FormElements";
import QuestionCardExtra from "./QuestionCardExtra";

const QuestionCard = memo(function QuestionCard({
  question,
}: {
  question: FormElementInstance;
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    index,
  } = useSortable({
    id: question.questionId,
    data: {
      type: "question",
      question,
      isQuestionElement: true,
    },
    // ^ disable or not to disable in large lists
    // animateLayoutChanges: () => false,
  });

  // ? update every single question's position
  // ? after one question is moved
  question.position = index;

  const DesignerElement =
    FormElements[question.questionType as ElementsType].designerComponent;

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // ^ CONSIDER USING THIS WAY OR PUT THIS INSIDE THE BELOW JSX
  if (question?.temp) {
    return (
      <div
        className="flex items-center opacity-30 h-[65px] border-[1px] border-[#1758BA] rounded-xl bg-white"
        style={style}
      ></div>
    );
  }

  return (
    <div className="relative w-full">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        dir="rtl"
        className={`flex items-center h-[65px] w-full relative justify-start flex-row p-2 border-[1px] rounded-xl bg-white ${
          isDragging
            ? "border-[#CCC] opacity-50"
            : "border-[#1758BA] opacity-100"
        }`}
      >
        <DesignerElement elementInstance={question} />
      </div>
      <QuestionCardExtra questionId={question?.questionId} index={index} />
    </div>
  );
});

export default QuestionCard;
