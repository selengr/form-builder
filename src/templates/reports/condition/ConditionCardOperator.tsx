import React from 'react';
import { IGetCondition } from '@/types/conditionReportSolo';
import HtmlPreview from '@/components/HtmlPreview/HtmlPreview';
import { TConditionData, TSubConditionData } from '@/lib/CreateSoloReportSchema';
import { useGetQacWithOutFilter } from '@/app/reports/create-solo/[id]/_hooks/useGetQacWithOutFilter';

interface IConditionCardOperatorProps {
  condition: IGetCondition;
}
interface IComboOption {
  value: string;
  caption: string;
}

const safeJsonParse = <T,>(input?: string | null): T | null => {
  try {
    return input ? JSON.parse(input) : null;
  } catch (e) {
    console.error('خطا در JSON.parse:', e);
    return null;
  }
};

const extractAfter = (text?: string, delimiter = '@') => text?.split(delimiter)?.[1] ?? '';

const extractBefore = (text?: string, delimiter = '@') => text?.split(delimiter)?.[0] ?? '';

export const ConditionCardOperator: React.FC<IConditionCardOperatorProps> = ({ condition }) => {
  const parseCondition = safeJsonParse<TConditionData>(condition?.frontConditionData);

  const { qacWithOutFilter } = useGetQacWithOutFilter();

  const formatValue = (item: TSubConditionData) => {
    const operatorType = extractBefore(item.operatorType);
    const questionType = extractBefore(item.questionType, '*');

    if (operatorType === 'OPTION' && questionType === 'MULTIPLE_CHOICE_MULTI_SELECT') {
      return Array.isArray(item.value) ? item.value.map((val: string) => extractAfter(val)).join(' , ') : '';
    }

    const operatorMapping: Record<string, string[]> = {
      OPTION: ['MULTIPLE_CHOICE', 'TEXT_FIELD_NUMBER'],
      QUESTION: ['MULTIPLE_CHOICE', 'TEXT_FIELD_NUMBER', 'TEXT_FIELD_DATE', 'CALCULATION', 'SPECTRAL'],
      CALCULATION: ['MULTIPLE_CHOICE', 'TEXT_FIELD_NUMBER', 'SPECTRAL', 'CALCULATION'],
    };

    if (operatorMapping[operatorType]?.includes(questionType)) {
      return extractAfter(item.operatorType);
    }

    return extractBefore(item.value?.toString());
  };

  const logicalOperatorMap: Record<string, string> = {
    '||': 'یا',
    '&&': 'و',
  };


  let updatedHtml: string = parseCondition?.returnText ?? "";

  qacWithOutFilter?.forEach((item: IComboOption) => {
    const regex = new RegExp(`\\{#([a-zA-Z0-9]+)_${item.value}\\}`, "g");
    updatedHtml = updatedHtml.replace(regex, item.caption);
  });

  updatedHtml = updatedHtml.replace(/<p[^>]*>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "");

  return (
    <div className='flex flex-col items-start justify-start w-full'>
      {Array.isArray(parseCondition?.subConditions) &&
        parseCondition?.subConditions?.map((item: TSubConditionData) => {
          const logicalOperator = item.logicalOperator ? (logicalOperatorMap[item.logicalOperator] ?? 'اگر') : 'اگر';
          const conditionType = extractAfter(item.conditionType);
          const questionType = extractAfter(item.questionType);
          const formattedValue = formatValue(item);

          return (
            <div key={item.id} className='flex flex-row gap-2 w-full'>
              <span className='text-[#161616] text-sm'>{logicalOperator}</span>
              <span className='text-[#1758BA] text-sm'>{questionType}</span>
              <span className='text-[#161616] text-sm'>{conditionType}</span>
              <span className='text-[#1758BA] text-sm'>{formattedValue}</span>
            </div>
          );
        })}

      {updatedHtml && (
        <span className='text-[#161616] text-sm w-full'>
          <span>نمایش بده: </span>
          {updatedHtml && (
            <HtmlPreview html={updatedHtml} />
          )}
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
