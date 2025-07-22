import React from "react";
import {IGetCondition} from "@/types/conditionReportSolo";
import {TConditionData, TSubConditionData} from "@/lib/CreateSoloReportSchema";

interface IConditionCardOperatorProps {
  condition: IGetCondition;
}

const safeJsonParse = <T,>(input?: string | null): T | null => {
  try {
    return input ? JSON.parse(input) : null;
  } catch (e) {
    console.error("خطا در JSON.parse:", e);
    return null;
  }
};

  const extractAfter = (text?: string, delimiter = "@") =>
    text?.split(delimiter)?.[1] ?? "";

  const extractBefore = (text?: string, delimiter = "@") =>
    text?.split(delimiter)?.[0] ?? "";

  export const ConditionCardOperator: React.FC<IConditionCardOperatorProps> = ({ condition }) => {
    const parseCondition = safeJsonParse<TConditionData>(condition?.frontConditionData);

    const formatValue = (item: TSubConditionData) => {
      const operatorType = extractBefore(item.operatorType);
      const questionType = extractBefore(item.questionType, "*");

      if (operatorType === "OPTION" && questionType === "MULTIPLE_CHOICE_MULTI_SELECT") {
        return Array.isArray(item.value)
          ? item.value.map((val: string) => extractAfter(val)).join(" , ")
          : "";
      }

    const operatorMapping: Record<string, string[]> = {
      OPTION: ["MULTIPLE_CHOICE", "TEXT_FIELD_NUMBER"],
      QUESTION: ["MULTIPLE_CHOICE", "TEXT_FIELD_NUMBER", "TEXT_FIELD_DATE", "CALCULATION", "SPECTRAL"],
      CALCULATION: ["MULTIPLE_CHOICE", "TEXT_FIELD_NUMBER", "SPECTRAL", "CALCULATION"],
    };

    if (operatorMapping[operatorType]?.includes(questionType)) {
      return extractAfter(item.operatorType);
    }

    return extractBefore(item.value?.toString());
  };

  const logicalOperatorMap: Record<string, string> = {
    "||": "یا",
    "&&": "و",
  };

  const returnText = safeJsonParse<{ content: string }>(parseCondition?.returnText);
  // const elseReturnText = safeJsonParse<{ content: string }>(parseCondition?.elseReturnText);

  return (
    <div className="flex flex-col items-start justify-start">
      {Array.isArray(parseCondition?.subConditions) && parseCondition?.subConditions?.map((item: TSubConditionData) => {
        const logicalOperator = item.logicalOperator ? logicalOperatorMap[item.logicalOperator] ?? "اگر" : "اگر";
        const conditionType = extractAfter(item.conditionType);
        const questionType = extractAfter(item.questionType);
        const formattedValue = formatValue(item);

        return (
          <div key={item.id} className="flex flex-row gap-2">
            <span className="text-[#161616] text-sm">{logicalOperator}</span>
            <span className="text-[#1758BA] text-sm">{questionType}</span>
            <span className="text-[#161616] text-sm">{conditionType}</span>
            <span className="text-[#1758BA] text-sm">{formattedValue}</span>
          </div>
        );
      })}

      {returnText?.content && (
        <span className="text-[#161616] text-sm">
          <span>نمایش بده: </span>
          <span className="text-[#1758BA]">{returnText.content}</span>
        </span>
      )}
{/* 
      {elseReturnText?.content && (
        <span className="text-[#161616] text-sm">
          <span>در غیر اینصورت نمایش بده: </span>
          <span className="text-[#1758BA]">{elseReturnText.content}</span>
        </span>
      )} */}
    </div>
  );
};