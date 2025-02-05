"use client";

import { IGetCondition } from "@/types/condition";
import { ConditionCard } from "./ConditionCard";
import CreateCondition from "./CreateCondition";


interface IConditionListProps {
  conditions: IGetCondition[];
}

const ConditionList: React.FC<IConditionListProps> = ({ conditions }) => {
  return (
    <div className="w-full max-w-md flex flex-col">
      <div
        dir="rtl"
        className="bg-[#F7F7FF] rounded-lg p-[10px] w-full flex flex-col gap-3"
      >
        {conditions?.map((condition: IGetCondition) => (
          // eslint-disable-next-line react/jsx-key
          <ConditionCard condition={condition} />
        ))}
      </div>
      <CreateCondition />
    </div>
  );
};

export default ConditionList;
