'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import useMediaQuery from '@mui/material/useMediaQuery';
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
import useActionOpenBottomSheet from '@/hooks/useActionOpenBottomSheet';
import emptyIllustration from '@/../public/images/home-page/notfound-meh.svg';
import LogicSortableItem from './LogicSortableItem';
import LogicBoardSkeleton from './LogicBoardSkeleton';
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
  const isMobile = useMediaQuery('(max-width:1280px)');
  const setOpenBottomSheet = useActionOpenBottomSheet();
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

  const dropZoneText = isMobile
    ? 'محاسبه‌گر یا شرط مورد نظر را از اینجا اضافه کنید'
    : 'محاسبه‌گر یا شرط خود را از پنل کناری به اینجا بکشید';

  const handleAddLogic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      setOpenBottomSheet(true);
    }
  };

  if (isLoading) {
    return <LogicBoardSkeleton className={disabled ? 'opacity-50 pointer-events-none' : undefined} />;
  }

  if (!items.length) {
    return (
      <div dir="rtl" className={containerClassName}>
        {!isMobile && (
          <div className="flex flex-col items-center justify-center py-16 px-6 h-[80%] min-h-[300px]">
            <Image
              src={emptyIllustration}
              alt=""
              width={350}
              height={220}
              className="opacity-80"
              draggable={false}
            />
            <p className="text-[#6F6F6F] text-[14px] md:text-[15px] font-semibold md:font-bold text-center">
              {dropZoneText}
            </p>
          </div>
        )}

        {isMobile && (
          <div
            className={`mx-3 mb-3 mt-2 flex items-center justify-center rounded-xl border border-dashed border-[#DDE1E6] bg-transparent min-h-[56px] ${
              !disabled ? 'cursor-pointer' : ''
            }`}
            onClick={handleAddLogic}
          >
            <p
              className={`p-3 text-[#6F6F6F] text-center text-sm font-medium ${
                !disabled ? 'cursor-pointer' : ''
              }`}
            >
              {dropZoneText}
              {' یا دکمه +'}
            </p>
          </div>
        )}
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
