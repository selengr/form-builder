'use client';

import { useWatch } from 'react-hook-form';
import { formatValue } from './utils/transformConditions';
import { TConditionData, TSubConditionData } from './schema';

interface ConditionFormulaDemoProps {
  calculatorFormula?: string;
}

type Token = { text: string; pending?: boolean };

const PENDING = '?';

const hasValue = (value: TSubConditionData['value']) =>
  Array.isArray(value) ? value.length > 0 : Boolean(value);

const buildSubConditionTokens = (subCondition: TSubConditionData, isFirst: boolean): Token[] => {
  const questionType = subCondition.questionType?.split('@')[0];
  const conditionType = subCondition.conditionType?.split('@')[0];
  const operatorType = subCondition.operatorType?.split('@')[0];
  const logicalOperator = subCondition.logicalOperator?.split('@')[0];

  let valueToken: Token = { text: PENDING, pending: true };
  if (operatorType) {
    try {
      valueToken = hasValue(subCondition.value)
        ? { text: formatValue(subCondition) }
        : { text: formatValue({ ...subCondition, value: PENDING }), pending: true };
    } catch {
      valueToken = { text: PENDING, pending: true };
    }
  }

  return [
    ...(!isFirst ? [{ text: ` ${logicalOperator || PENDING} `, pending: !logicalOperator }] : []),
    conditionType ? { text: conditionType } : { text: PENDING, pending: true },
    { text: '(' },
    { text: questionType?.split('*')[1] ?? PENDING, pending: !questionType },
    { text: ',' },
    valueToken,
    { text: ')' },
  ];
};

const buildConditionTokens = (conditions: TConditionData[] | undefined): Token[][] =>
  (conditions ?? []).map((condition) =>
    (condition.subConditions ?? [])
      .filter((subCondition) => subCondition?.questionType)
      .flatMap((subCondition, index) => buildSubConditionTokens(subCondition, index === 0)),
  );

const buildCalculatorTokens = (formula: string | undefined): Token[] =>
  (formula ?? '')
    .split(/(\?)/)
    .filter(Boolean)
    .map((text) => ({ text, pending: text === PENDING }));

const tokenColor = (token: Token) => (token.pending ? '#F5A524' : '#E2E8F0');

function FormulaLine({ label, tokens }: { label: string; tokens: Token[] }) {
  return (
    <div className="flex flex-col" style={{ gap: 6 }}>
      <span style={{ fontSize: 12, color: '#94A3B8' }}>{label}</span>
      <pre
        dir="ltr"
        style={{
          margin: 0,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
          fontSize: 15,
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          textAlign: 'left',
        }}>
        {tokens.length ? (
          tokens.map((token, index) => (
            <span key={index} style={{ color: tokenColor(token) }}>
              {token.text}
            </span>
          ))
        ) : (
          <span style={{ color: '#64748B' }}>-</span>
        )}
      </pre>
    </div>
  );
}

export default function ConditionFormulaDemo({ calculatorFormula }: ConditionFormulaDemoProps) {
  const conditions = useWatch({ name: 'conditions' }) as TConditionData[] | undefined;
  const conditionTokens = buildConditionTokens(conditions);

  return (
    <div
      className="w-full flex flex-col rounded-xl"
      style={{ marginTop: 12, padding: 16, gap: 14, background: '#0F172A', border: '1px solid #1E293B' }}>
      {conditionTokens.length ? (
        conditionTokens.map((tokens, index) => <FormulaLine key={index} label="شرط" tokens={tokens} />)
      ) : (
        <FormulaLine label="شرط" tokens={[]} />
      )}
      <FormulaLine label="محاسبه" tokens={buildCalculatorTokens(calculatorFormula)} />
    </div>
  );
}
