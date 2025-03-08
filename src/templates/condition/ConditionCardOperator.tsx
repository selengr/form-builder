import { IGetCondition } from "@/types/condition";
import { TConditionData, TSubConditionData } from "@/lib/ConditionFormSchema";


interface IConditionCardOperatorProps {
  condition: IGetCondition;
}

export const ConditionCardOperator: React.FC<IConditionCardOperatorProps> = ({ condition }) => {
  const parseCondition : TConditionData = JSON.parse(condition?.frontConditionData)

  const formatValue = (item:TSubConditionData) => {
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
      {parseCondition?.subConditions?.map((item:TSubConditionData) => {
          const logicalOperator = item.logicalOperator?.split("@")[1] ?? "اگر";
          const conditionType = item.conditionType?.split("@")[1];
          const questionType = item.questionType?.split("@")[1];
          const formattedValue = formatValue(item);

        return (
          <div key={item.id} className="flex flex-row gap-2">
            <span className="text-[#161616] text-sm">{logicalOperator}</span>
            <span className="text-[#1758BA] text-sm">{questionType}</span>
            <span className="text-[#161616] text-sm">{conditionType}</span>
            <span className="text-[#1758BA] text-sm">{formattedValue}</span>
          </div>
        )
      })}
      <span className="text-[#161616] text-sm">
        <span>در اینصورت برو به: </span>
        <span className="text-[#1758BA]">{parseCondition?.returnQuestionId?.split("@")[1]}</span>
      </span>
      {parseCondition?.elseQuestionId && (
        <span className="text-[#161616] text-sm">
          <span>در غیر اینصورت برو به:</span>
          <span className="text-[#1758BA]">
            {parseCondition?.elseQuestionId.toString()?.split("@")[1]}
          </span>
        </span>
      )}
    </div>
  );
};