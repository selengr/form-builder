'use client';

import { useWatch } from 'react-hook-form';
import { transformConditions } from './utils/transformConditions';
import { TConditionData } from './schema';

interface ConditionFormulaDemoProps {
  formId: string;
}

const buildFormula = (conditions: TConditionData[] | undefined, formId: string) => {
  if (!conditions?.length) return '';

  const filled = conditions.map((condition) => ({
    ...condition,
    subConditions: (condition.subConditions ?? []).filter(
      (subCondition) => subCondition?.questionType && subCondition?.conditionType,
    ),
  }));

  try {
    return transformConditions({ conditions: filled }, formId)
      .map((item) => item.conditionFormula)
      .filter(Boolean)
      .join('\n');
  } catch (error) {
    return `error: ${(error as Error).message}`;
  }
};

export default function ConditionFormulaDemo({ formId }: ConditionFormulaDemoProps) {
  const conditions = useWatch({ name: 'conditions' }) as TConditionData[] | undefined;
  const formula = buildFormula(conditions, formId);

  return (
    <div
      className="w-full rounded-xl"
      style={{ marginTop: 12, padding: 14, background: '#1E1E2E', color: '#E0E0E0' }}>
      <div style={{ fontSize: 12, color: '#9A9A9A', marginBottom: 8 }}>demo - condition formula</div>
      <pre
        dir="ltr"
        style={{
          margin: 0,
          fontFamily: 'monospace',
          fontSize: 13,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          textAlign: 'left',
          minHeight: 20,
        }}>
        {formula || '-'}
      </pre>
    </div>
  );
}
