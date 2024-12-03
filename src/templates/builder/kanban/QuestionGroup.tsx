import { useMemo, memo } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import QuestionCard from "./QuestionCard";
import { FormElementInstance } from "../../../types/FormElements";
// import GroupPopUpMenu from "../../components/GroupPopUpMenu";
import useActionOpenBottomSheet from "@/hooks/useActionOpenBottomSheet";
import useActionDesigner from "@/hooks/useActionDesigner";
import { useDroppable } from "@dnd-kit/core";
import { useResponsive } from "@/hooks/useResponsive";

const QuestionGroup = memo(function QuestionGroup({
  group,
  questions,
}: {
  group: number;
  questions: FormElementInstance[];
}) {
  const setOpenBottomSheet = useActionOpenBottomSheet();
  const { setSelectedGroup } = useActionDesigner();
  const isMobile = useResponsive("down", "md");
  const questionsIds = useMemo(() => {
    return questions?.map((question: any) => question?.questionId);
  }, [questions]);

  const droppable = useDroppable({
    id: group,
    data: {
      type: "question-group",
      group,
    },
  });

  return (
    <div
      className={`flex flex-col w-full rounded-xl items-center justify-center bg-[#f7f7f7] ${
        questions?.length >= 1 ? "" : "border-[1px] border-[#1758BA]"
      }`}
      ref={droppable.setNodeRef}
    >
      {questions?.length >= 1 && (
        <div className="flex flex-col w-full min-h-[60px] px-2 pt-2 flex-grow gap-4">
          <SortableContext
            items={questionsIds}
            strategy={verticalListSortingStrategy}
          >
            {questions?.map((question: FormElementInstance, index: number) => (
              <QuestionCard key={questionsIds[index]} question={question} />
            ))}
          </SortableContext>
        </div>
      )}

      <div className="flex flex-row-reverse items-center justify-center py-2 w-full">
        {isMobile ? (
          <p
            className="p-2 text-[#424242] text-center text-sm font-bold"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedGroup(group);
              setOpenBottomSheet(true);
            }}
          >
            برای افزودن سوال این قسمت را لمس کنید
          </p>
        ) : (
          <p className="p-2 text-[#424242] text-center font-bold">
            نوع سوال را از فهرست کناری نگه داشته و بکشید
          </p>
        )}
        {/* <GroupPopUpMenu groupId={group} /> */}
      </div>
    </div>
  );
});

export default QuestionGroup;
