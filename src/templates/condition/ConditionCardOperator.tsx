import { TConditionData } from "@/lib/conditionFormSchema";

interface IConditionCardOperatorProps {
  condition: TConditionData;
}

export const ConditionCardOperator: React.FC<IConditionCardOperatorProps> = ({ condition }) => {
  return (
    <div className="flex flex-col">
      {condition?.subConditions?.map((item) => (
        <div key={item.id} className="flex flex-row gap-2">
          <span className="text-[#161616] text-sm">{item.logicalOperator?.split("@")[1] ?? "اگر"}</span>
          <span className="text-[#1758BA] text-sm">{item.questionType?.split("@")[1]}</span>
          <span className="text-[#161616] text-sm">{item.conditionType?.split("@")[1]}</span>
          <span className="text-[#1758BA] text-sm">{item.value}</span>
        </div>
      ))}
      <span className="text-[#161616] text-sm">
        <span>در اینصورت برو به: </span>
        <span className="text-[#1758BA]">{condition.returnQuestionId.toString()?.split("@")[1]}</span>
      </span>
      {condition.elseQuestionId && (
        <span className="text-[#161616] text-sm">
          <span>در غیر اینصورت برو به:</span>
          <span className="text-[#1758BA]">
            {condition.elseQuestionId.toString()?.split("@")[1]}
          </span>
        </span>
      )}
    </div>
  );
};