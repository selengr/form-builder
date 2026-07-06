'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CalculatorCard } from '@/templates/calculator/CalculatorCard';
import { ConditionCard } from '@/templates/condition/ConditionCard';
import { useGetQacWithOutFilterList } from '@/app/reports/create-solo/[id]/_hooks/useGetQacWithOutFilterList';
import { IGetCondition } from '@/types/condition';
import LogicSortableItem from './LogicSortableItem';
import { LogicItem, mergeLogicItems } from './types';
import { useLogicItems } from './useLogicItems';

interface LogicBoardProps {
  disabled?: boolean;
  onEditCalculator: (id: number) => void;
  onEditCondition: (condition: IGetCondition) => void;
}

export default function LogicBoard({
  disabled = false,
  onEditCalculator,
  onEditCondition,
}: LogicBoardProps) {
  const { calculators, conditions, isLoading, invalidate } = useLogicItems(true);
  const { qacWithOutFilterOptions } = useGetQacWithOutFilterList();
  const [items, setItems] = useState<LogicItem[]>([]);

  const mergedItems = useMemo(
    () => mergeLogicItems(calculators, conditions),
    [calculators, conditions],
  );

  useEffect(() => {
    setItems(mergedItems);
  }, [mergedItems]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((item) => item.sortId === active.id);
      const newIndex = prev.findIndex((item) => item.sortId === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const containerClassName = `flex flex-col w-full h-full rounded-2xl border border-[#DDE1E6] bg-[#F8FAFC] overflow-hidden ${
    disabled ? 'opacity-50 pointer-events-none' : ''
  }`;

  if (isLoading) {
    return (
      <div className={containerClassName}>
        <div className="flex items-center justify-center h-full min-h-[300px] text-[#888] text-sm">
          در حال بارگیری منطق…
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className={containerClassName}>
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-[#888] text-sm font-medium px-6 text-center">
          برای افزودن محاسبه‌گر یا شرط، از پنل کناری یا دکمه + استفاده کنید
        </div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div dir="rtl" className={containerClassName}>
        <div className="flex flex-col w-full px-3 pt-3 gap-2 pb-3">
          <SortableContext
            items={items.map((item) => item.sortId)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item, index) => (
              <LogicSortableItem
                key={item.sortId}
                id={item.sortId}
                disabled={disabled}
              >
                {item.kind === 'calculator' ? (
                  <CalculatorCard
                    index={index}
                    calculator={item.data}
                    disabled={disabled}
                    onEdit={onEditCalculator}
                    onDeleteSuccess={invalidate}
                  />
                ) : (
                  <ConditionCard
                    index={index}
                    condition={item.data}
                    disabled={disabled}
                    qacWithOutFilterOptions={qacWithOutFilterOptions}
                    onEdit={() => onEditCondition(item.data)}
                    onDeleteSuccess={invalidate}
                  />
                )}
              </LogicSortableItem>
            ))}
          </SortableContext>
        </div>
      </div>
    </DndContext>
  );
}
