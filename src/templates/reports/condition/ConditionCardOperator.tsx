import { IGetCondition } from "@/types/conditionReportSolo";
import { TConditionData, TSubConditionData } from "@/lib/CreateSoloReportSchema";


interface IConditionCardOperatorProps {
  condition: IGetCondition;
}

export const ConditionCardOperator: React.FC<IConditionCardOperatorProps> = ({ condition }) => {
  const parseCondition : TConditionData = JSON.parse(condition?.frontConditionData)
  
const formatValue = (item: TSubConditionData) => {
  const operatorType = item.operatorType?.split("@")[0];
  const questionType = item.questionType?.split("*")[0];
  if (operatorType === "OPTION" && questionType === "MULTIPLE_CHOICE_MULTI_SELECT") {
    return Array.isArray(item.value)
      ? item.value.map((val: string) => val.split("@")[1]).join(" , ")
      : "";
  }
  const operatorMapping: Record<string, string[]> = {
    "OPTION": ["MULTIPLE_CHOICE", "TEXT_FIELD_NUMBER"],
    "QUESTION": ["MULTIPLE_CHOICE", "TEXT_FIELD_NUMBER","TEXT_FIELD_DATE","CALCULATION","SPECTRAL"],
    "CALCULATION": ["MULTIPLE_CHOICE", "TEXT_FIELD_NUMBER", "SPECTRAL", "CALCULATION"],
  };
  if (operatorMapping[operatorType]?.includes(questionType)) {
    return item.operatorType?.split("@")[1] || "";
  }
  return item.value?.toString()?.split("@")[0] || "";
};

  const logicalOperatorMap: Record<string, string> = {
    "||": "یا",
    "&&": "و",
  };

  return (
    <div className="flex flex-col">
      {parseCondition?.subConditions?.map((item:TSubConditionData) => {
          const logicalOperator = item.logicalOperator ? logicalOperatorMap[item.logicalOperator] || "اگر" : "اگر";
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
        <span>در اینصورت نمایش بده: </span>
        <span className="text-[#1758BA]">{parseCondition?.returnText}</span>
      </span>
      {parseCondition?.elseReturnText && (
        <span className="text-[#161616] text-sm">
          <span>در غیر اینصورت نمایش بده:</span>
          <span className="text-[#1758BA]">
            {parseCondition?.elseReturnText}
          </span>
        </span>
      )}
    </div>
  );
};