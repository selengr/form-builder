"use client";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
// dnd
import {
  useSensor,
  DndContext,
  useSensors,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
// templates
import CreateCondition from "./CreateCondition";
import { ConditionCard } from "./ConditionCard";
import { idGenerator } from "@/lib/idGenerator";
// types
import { IGetCondition } from "@/types/conditionReportSolo";
import { useUpdateReportPosition } from "@/app/reports/create-solo/[id]/_hooks/useUpdateReportPosition";

interface IConditionListProps {
  conditions: IGetCondition[];
}

const ConditionList: React.FC<IConditionListProps> = ({
  conditions: initialConditions,
}) => {
  const { id } = useParams();
  const [conditions, setConditions] = useState<IGetCondition[]>(
    Array.isArray(initialConditions) ? initialConditions : []
  );
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
    <div className="w-full max-w-md flex flex-col pt-">
      <CreateCondition />
      {Array.isArray(conditions) && conditions.length > 0 && (
        <div
          dir="rtl"
          className="bg-[#F7F7FF] rounded-lg p-[10px] w-full flex flex-col gap-3 -pb-10 mb-0"
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
                <div key={idGenerator()}>
                  <ConditionCard condition={condition} index={index} />
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
