"use client";
import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
// dnd
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToWindowEdges, } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, } from "@dnd-kit/sortable";
// templates
import CreateCondition from "./CreateCondition";
import { ConditionCard } from "./ConditionCard";
import { idGenerator } from "@/lib/idGenerator";
// types
import { IGetCondition } from "@/types/conditionReportSolo";
import { useUpdateReportPosition } from "@/app/reports/create-solo/[id]/_hooks/useUpdateReportPosition";

interface IConditionListProps {
  conditions: IGetCondition[];
  setConditions: any
}

const ConditionList: React.FC<IConditionListProps> = ({
  conditions,
  setConditions
}) => {
  const { id } = useParams();
  const searchParams = useSearchParams()
  const search = searchParams.get('rep')
  const admin = search === "list"

  const { mutate: updatePosition, isPending: isUpdatingPosition } =
    useUpdateReportPosition();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const conditionsIds = useMemo(() => {
    return conditions.map((condition) => condition.id);
  }, [conditions]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = conditions.findIndex((item) => item.id === active.id);
      const newIndex = conditions.findIndex((item) => item.id === over?.id);

      const movedCondition = conditions[oldIndex];

      const newConditions = arrayMove(conditions, oldIndex, newIndex);
      setConditions(newConditions);

      updatePosition(
        {
          formBuilderId: id,
          conditionId: movedCondition.id,
          newPosition: newIndex,
        },
        {
          onSuccess: () => {
            // refresh()
            // handleClose()
          },
          onError: (error: any) => {
            // ...
          },
        }
      );
    }
  };

  return (
    <div className="w-full max-w-[500px] flex flex-col pt-">
      {!admin && <CreateCondition />}
      {Array.isArray(conditions) && conditions.length > 0 && (
        <div
          dir="rtl"
          className="rounded-lg p-[10px] w-full flex flex-col gap-3 -pb-10 mb-0"
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
          >
            <SortableContext
              items={conditionsIds}
              strategy={verticalListSortingStrategy}
            >
              {conditions?.map((condition: IGetCondition, index: number) => (
                // eslint-disable-next-line react/jsx-key
                <div className="bg-[#F7F7FF] gap-[3px] rounded-[8px] p-[10px]" key={idGenerator()}>
                  <ConditionCard condition={condition} index={index} admin={admin} />
                </div>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default ConditionList;
