import { IGetCondition } from '@/types/condition';
import { TConditionData, TSubConditionData } from '@/lib/ConditionFormSchema';

interface IConditionCardOperatorProps {
  condition: IGetCondition;
  qacWithOutFilterOptions?: any[];
}

export const ConditionCardOperator: React.FC<IConditionCardOperatorProps> = ({ condition, qacWithOutFilterOptions }) => {
  const parseCondition: TConditionData = JSON.parse(condition?.frontConditionData);

  function findOptionLabel(item: any, key: string) {
    const option = item.options?.[key];
    return option ? option[1] : undefined;
  }

  const formatValue = (item: TSubConditionData) => {
    const operatorType = item.operatorType?.split('@')[0];
    const questionType = item.questionType?.split('*')[0];
    if (operatorType === 'OPTION' && questionType === 'MULTIPLE_CHOICE_MULTI_SELECT' || questionType === "MULTIPLE_CHOICE" && operatorType === 'OPTION') {
      const questionId = item.questionType?.split('*')[1];
      const compared = questionId?.split('@')[0];
      const found = qacWithOutFilterOptions?.find(
        (val) => val?.value.includes(compared)
      );

      if (found) {
        if (Array.isArray(item.value)) {
          return item.value
            .map((val: string) => findOptionLabel(found, val.split('@')[0]))
            .join(", ");
        } else {
          return findOptionLabel(found, (item.value as string).split('@')[0]);
        }
      }
    }

    if (operatorType === 'QUESTION' && questionType === "MULTIPLE_CHOICE") {
        const find: any = item.value
        if (qacWithOutFilterOptions) {
          return valueFound(find.split('@')[0]);
        }
    }

    const operatorMapping: Record<string, string[]> = {
      OPTION: ['MULTIPLE_CHOICE', 'TEXT_FIELD_NUMBER', 'RATING'],
      QUESTION: ['MULTIPLE_CHOICE', 'TEXT_FIELD_NUMBER', 'RATING', 'TEXT_FIELD_DATE', 'CALCULATION', 'SPECTRAL'],
      CALCULATION: ['MULTIPLE_CHOICE', 'TEXT_FIELD_NUMBER', 'RATING', 'SPECTRAL', 'CALCULATION'],
    };

    if (operatorMapping[operatorType]?.includes(questionType)) {
      const find: any = item.value
      if (qacWithOutFilterOptions) {
        return valueFound(find.split('@')[0]);
      }
    }
    return item.value?.toString()?.split('@')[0] || '';
  };

  const logicalOperatorMap: Record<string, string> = {
    '||': 'یا',
    '&&': 'و',
  };

  const valueFound = (compared: string) => {

    const found = qacWithOutFilterOptions?.find(
      (val) => val?.value.includes(compared)
    );

    return found?.label ?? "null";

  };

  const returnQuestionIdFound = () => {
    if (!parseCondition?.returnQuestionId) return "null";

    const compared = parseCondition?.returnQuestionId?.split('@')[0]
    const found = qacWithOutFilterOptions?.find(
      (val) => val?.value.includes(compared)
    );
    return found?.label ?? "null";
  };

  const elseQuestionIdFound = () => {
    if (!parseCondition?.returnQuestionId) return "null";

    const compared = parseCondition?.elseQuestionId?.split('@')[0]

    const found = qacWithOutFilterOptions?.find(
      (val) => val?.value.includes(compared)
    );
    return found?.label ?? "null";
  };

  return (
    <div className='flex flex-col'>
      {parseCondition?.subConditions?.map((item: TSubConditionData) => {
        const logicalOperator = item.logicalOperator ? logicalOperatorMap[item.logicalOperator] || 'اگر' : 'اگر';
        const conditionType = item.conditionType?.split('@')[1];
        const formattedValue = formatValue(item);

        const extractedFromList = () => {
          if (!item?.questionType) return "null";

          const compared = item.questionType.split('@')[0];

          const found = qacWithOutFilterOptions?.find(
            (val) => val?.value.includes(compared)
          );
          return found?.label ?? "null";
        };



        return (
          <div key={item.id} className='flex flex-row gap-2'>
            <span className='text-[#161616] text-sm'>{logicalOperator}</span>
            <span className='text-[#1758BA] text-sm'>{extractedFromList()}</span>
            <span className='text-[#161616] text-sm'>{conditionType}</span>
            <span className='text-[#1758BA] text-sm'>{formattedValue}</span>
          </div>
        );
      })}
      <span className='text-[#161616] text-sm'>
        <span>در اینصورت برو به: </span>
        <span className='text-[#1758BA]'>{returnQuestionIdFound()}</span>
      </span>
      {parseCondition?.elseQuestionId && (
        <span className='text-[#161616] text-sm'>
          <span>در غیر اینصورت برو به: </span>
          <span className='text-[#1758BA]'>{elseQuestionIdFound()}</span>
        </span>
      )}
    </div>
  );
};
