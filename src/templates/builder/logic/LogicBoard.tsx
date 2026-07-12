'use client';

import Image from 'next/image';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDroppable } from '@dnd-kit/core';
import { CalculatorCard } from '@/templates/calculator/CalculatorCard';
import { ConditionCard } from '@/templates/condition/ConditionCard';
import { useGetQacWithOutFilterList } from '@/app/reports/create-solo/[id]/_hooks/useGetQacWithOutFilterList';
import { IGetCondition } from '@/types/condition';
import useActionOpenBottomSheet from '@/hooks/useActionOpenBottomSheet';
import emptyIllustration from '@/../public/images/home-page/notfound-meh.svg';
import LogicBoardSkeleton from './LogicBoardSkeleton';
import { mergeLogicItems } from './types';
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

  const items = mergeLogicItems(calculators, conditions);

  const droppable = useDroppable({
    id: 'logic-board',
    data: { type: 'logic-board' },
    disabled,
  });

  const containerClassName = `flex flex-col w-full h-full min-h-[300px] rounded-2xl border border-[#DDE1E6] bg-[#F8FAFC] overflow-hidden ${
    droppable.isOver && !disabled ? 'ring-2 ring-[#2CDFC9] ring-inset' : ''
  } ${disabled ? 'opacity-50 pointer-events-none' : ''}`;

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

  return (
    <div dir="rtl" ref={droppable.setNodeRef} className={containerClassName}>
      {!items.length ? (
        <>
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
        </>
      ) : (
        <div className="flex flex-col w-full px-3 pt-3 gap-2 pb-3">
          {items.map((item, index) =>
            item.kind === 'calculator' ? (
              <CalculatorCard
                key={item.sortId}
                index={index}
                calculator={item.data}
                disabled={disabled}
                onEdit={onEditCalculator}
                onDeleteSuccess={invalidate}
              />
            ) : (
              <ConditionCard
                key={item.sortId}
                index={index}
                condition={item.data}
                disabled={disabled}
                qacWithOutFilterOptions={qacWithOutFilterOptions}
                onEdit={() => onEditCondition(item.data)}
                onDeleteSuccess={invalidate}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}
