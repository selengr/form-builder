"use client";

import { IGetCondition } from "@/types/condition";
import { ConditionCard } from "./ConditionCard";
import CreateCondition from "./CreateCondition";
import { idGenerator } from "@/lib/idGenerator";

interface IConditionListProps {
  conditions: IGetCondition[];
}

const ConditionList: React.FC<IConditionListProps> = ({ conditions }) => {
  return (
    <div className="w-full max-w-md flex flex-col pt-4">
      <CreateCondition />
      {Array.isArray(conditions) && conditions.length > 0 && (
        <div
          dir="rtl"
          className="bg-[#F7F7FF] rounded-lg p-[10px] w-full flex flex-col gap-3 pb-10 mb-10"
        >
          {conditions?.map((condition: IGetCondition, index: number) => (
            // eslint-disable-next-line react/jsx-key
            <div  key={idGenerator()}> 
                 <ConditionCard condition={condition} index={index} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConditionList;
