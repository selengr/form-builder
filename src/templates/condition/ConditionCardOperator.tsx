import { IGetCondition } from "@/types/condition";
import { TConditionData, TSubConditionData } from "@/lib/conditionFormSchema";


interface IConditionCardOperatorProps {
  condition: IGetCondition;
}

export const ConditionCardOperator: React.FC<IConditionCardOperatorProps> = ({ condition }) => {
  const parseCondition : TConditionData[] = JSON.parse(condition?.frontConditionData).conditions

  const formattedValue = (item:TSubConditionData) => {
    if (item.operatorType?.split("@")[0] === "OPTION" && item.questionType?.split("*")[0] === "MULTIPLE_CHOICE_MULTI_SELECT") {
      const op : string[] = []
      if(Array.isArray(item.value)){
            item.value?.map((item:string)=>op.push(item?.toString()?.split("@")[1]))
      } 
      return op.join(" , ");      
    } else return item.value?.toString()?.split("@")[0];  
}


  return (
    <div className="flex flex-col">
      {parseCondition[0]?.subConditions?.map((item:TSubConditionData) => {
        return (
          <div key={item.id} className="flex flex-row gap-2">
            <span className="text-[#161616] text-sm">{item.logicalOperator?.split("@")[1] ?? "اگر"}</span>
            <span className="text-[#1758BA] text-sm">{item.questionType?.split("@")[1]}</span>
            <span className="text-[#161616] text-sm">{item.conditionType?.split("@")[1]}</span>
            <span className="text-[#1758BA] text-sm">{formattedValue(item)}</span>
          </div>
        )
      })}
      <span className="text-[#161616] text-sm">
        <span>در اینصورت برو به: </span>
        <span className="text-[#1758BA]">{parseCondition[0].returnQuestionId.toString()?.split("@")[1]}</span>
      </span>
      {parseCondition[0].elseQuestionId && (
        <span className="text-[#161616] text-sm">
          <span>در غیر اینصورت برو به:</span>
          <span className="text-[#1758BA]">
            {parseCondition[0].elseQuestionId.toString()?.split("@")[1]}
          </span>
        </span>
      )}
    </div>
  );
};