"use client";
// lib
import { idGenerator } from "@/lib";
// hooks
import { useFormData } from "@/hooks";
// types
import { IGetCondition } from "@/types/condition";
// view
import { ConditionCard } from "./ConditionCard";
import CreateCondition from "./CreateCondition";

interface IProps {
  conditions: IGetCondition[];
}

const ConditionList: React.FC<IProps> = ({ conditions }) => {
  const { formData, isLoading } = useFormData();

  return (
    <div className="w-full max-w-[520px] flex flex-col p-[13px] overflow-hidden">
      {formData?.formSettingModel?.formStatus === "CREATE" && (
        <CreateCondition />
      )}
      {Array.isArray(conditions) && conditions.length > 0 && (
        <div
          dir="rtl"
          className="bg-[#F7F7FF] rounded-lg p-[10px] w-full flex flex-col gap-3  mb-10 overflow-y-auto"
        >
          {conditions?.map((condition: IGetCondition, index: number) => (
            <ConditionCard
              key={idGenerator()}
              condition={condition}
              index={index}
              disabled={
                isLoading || formData?.formSettingModel?.formStatus !== "CREATE"
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ConditionList;
