import { IGetCondition } from '@/types/condition';
import { TConditionData, TSubConditionData } from '@/lib/ConditionFormSchema';
import {
  ConditionLogicPill,
} from './ConditionCardParts';
import { DottedLineWithDots } from './SubConditionDivider';

interface IConditionCardOperatorProps {
  condition: IGetCondition;
  qacWithOutFilterOptions?: { value: string; label: string }[];
}

const logicalOperatorMap: Record<string, 'purple' | 'red'> = {
  '&&': 'purple',
  '||': 'red',
};

const logicalOperatorLabel: Record<string, string> = {
  '&&': 'و',
  '||': 'یا',
};

function findOptionLabel(item: { options?: Record<string, [number, string]> }, key: string) {
  const option = item.options?.[key];
  return option ? option[1] : undefined;
}

function labelFromStoredId(
  storedId: string | undefined,
  qacWithOutFilterOptions?: { value: string; label: string }[],
) {
  if (!storedId) return '—';

  const compared = storedId.split('@')[0];
  const suffixLabel = storedId.split('@').at(-1);

  const found = qacWithOutFilterOptions?.find((val) => val?.value.includes(compared));
  if (found?.label) return found.label;
  if (suffixLabel && suffixLabel !== compared) return suffixLabel;

  return '—';
}

function questionLabel(
  item: TSubConditionData,
  qacWithOutFilterOptions?: { value: string; label: string }[],
) {
  if (!item?.questionType) return '—';

  const compared = item.questionType.split('*')[1]?.split('@')[0] ?? item.questionType.split('@')[0];
  const suffixLabel = item.questionType.split('@').at(-1);

  const found = qacWithOutFilterOptions?.find((val) => val?.value.includes(compared));
  if (found?.label) return found.label;
  if (suffixLabel && !suffixLabel.includes('{')) return suffixLabel;

  return '—';
}

function formatValue(
  item: TSubConditionData,
  qacWithOutFilterOptions?: { value: string; label: string }[],
) {
  const operatorType = item.operatorType?.split('@')[0];
  const questionType = item.questionType?.split('*')[0];

  if (
    (operatorType === 'OPTION' && questionType === 'MULTIPLE_CHOICE_MULTI_SELECT') ||
    (questionType === 'MULTIPLE_CHOICE' && operatorType === 'OPTION')
  ) {
    const questionId = item.questionType?.split('*')[1];
    const compared = questionId?.split('@')[0];
    const found = qacWithOutFilterOptions?.find((val) => val?.value.includes(compared));

    if (found) {
      if (Array.isArray(item.value)) {
        return item.value
          .map((val: string) => findOptionLabel(found as any, val.split('@')[0]))
          .join('، ');
      }
      return findOptionLabel(found as any, (item.value as string).split('@')[0]) ?? '—';
    }
  }

  const operatorMapping: Record<string, string[]> = {
    OPTION: ['MULTIPLE_CHOICE', 'TEXT_FIELD_NUMBER', 'RATING'],
    QUESTION: ['MULTIPLE_CHOICE', 'TEXT_FIELD_NUMBER', 'RATING', 'TEXT_FIELD_DATE', 'CALCULATION', 'SPECTRAL'],
    CALCULATION: ['MULTIPLE_CHOICE', 'TEXT_FIELD_NUMBER', 'RATING', 'SPECTRAL', 'CALCULATION'],
  };

  if (operatorMapping[operatorType ?? '']?.includes(questionType ?? '')) {
    const find = item.value as string;
    if (qacWithOutFilterOptions) {
      return labelFromStoredId(find, qacWithOutFilterOptions);
    }
  }

  const raw = item.value?.toString() ?? '';
  const suffix = raw.split('@').at(-1);
  if (suffix && suffix !== raw.split('@')[0]) return suffix;

  return raw.split('@')[0] || '—';
}

function operatorLabel(item: TSubConditionData) {
  return item.conditionType?.split('@')[1] ?? '—';
}

export const ConditionCardOperator: React.FC<IConditionCardOperatorProps> = ({
  condition,
  qacWithOutFilterOptions,
}) => {
  const parseCondition: TConditionData = JSON.parse(condition?.frontConditionData ?? '{}');

  const returnLabel = labelFromStoredId(parseCondition?.returnQuestionId, qacWithOutFilterOptions);
  const elseLabel = labelFromStoredId(parseCondition?.elseQuestionId, qacWithOutFilterOptions);

  return (
    <div dir="rtl" className="flex flex-col pt-2 gap-[6px] w-full">
      {parseCondition?.subConditions?.map((item: TSubConditionData, rowIndex: number) => {
        const isFirst = rowIndex === 0;
        const logicalOp = item.logicalOperator?.split('@')[0];
        const logicalVariant = logicalOp ? logicalOperatorMap[logicalOp] : null;

        return (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-start gap-x-2 gap-y-1.5 text-[13px] text-[#161616]"
          >
            {isFirst ? (
              <span className="font-bold text-[#161616]">اگر</span>
            ) : logicalVariant ? (
              <ConditionLogicPill variant={logicalVariant}>
                {logicalOperatorLabel[logicalOp!] ?? logicalOp}
              </ConditionLogicPill>
            ) : null}

            <ConditionLogicPill variant="blue">{questionLabel(item, qacWithOutFilterOptions)}</ConditionLogicPill>

            <span className="text-[#5A4154] font-normal">{operatorLabel(item)}</span>

            <ConditionLogicPill variant="green">{formatValue(item, qacWithOutFilterOptions)}</ConditionLogicPill>
          </div>
        );
      })}

      <div className="flex"><DottedLineWithDots /><div className="w-4"/></div>

      <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-1.5">
        <ConditionLogicPill variant="greenAction">برو به</ConditionLogicPill>
        <ConditionLogicPill variant="blue">{returnLabel}</ConditionLogicPill>
      </div>

      {parseCondition?.elseQuestionId && (
        <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-1.5">
          <ConditionLogicPill variant="orange">در غیر این صورت</ConditionLogicPill>
          <ConditionLogicPill variant="blue">{elseLabel}</ConditionLogicPill>
        </div>
      )}
    </div>
  );
};
