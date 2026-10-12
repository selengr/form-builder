'use client';

import { ReactNode } from 'react';
import { useWatch } from 'react-hook-form';
import {
  getConditionField,
  getConditionOperator,
  toConditionValue,
  toNextOperator,
} from './utils/buildConditionGroup';
import { TConditionData, TSubConditionData } from './schema';
import styles from './conditionFormulaDemo.module.css';

interface ConditionFormulaDemoProps {
  majorId?: string;
  minorName?: string;
  formId: string;
  calculatorFormula?: string;
}

const COLORS = {
  background: '#F4F5F7',
  border: '#DDE1E6',
  label: '#6F7782',
  punctuation: '#404040',
  key: '#1758BA',
  string: '#2F855A',
  number: '#C2410C',
  keyword: '#7C3AED',
  pending: '#FA4D56',
};

const hasValue = (value: TSubConditionData['value']) =>
  Array.isArray(value) ? value.length > 0 : Boolean(value);

const toNumberOrNull = (value?: string) => (value && Number.isFinite(Number(value)) ? Number(value) : null);

const buildLiveChild = (subCondition: TSubConditionData, nextSubCondition?: TSubConditionData) => ({
  type: 'condition',
  field: subCondition.questionType ? getConditionField(subCondition.questionType) : null,
  operator: subCondition.conditionType ? (getConditionOperator(subCondition.conditionType) ?? null) : null,
  value: subCondition.operatorType && hasValue(subCondition.value) ? toConditionValue(subCondition) : null,
  nextOperator: toNextOperator(nextSubCondition?.logicalOperator),
});

const buildLivePayload = (
  conditions: TConditionData[] | undefined,
  majorId: string | undefined,
  minorName: string | undefined,
  formId: string,
) => {
  const subConditions = (conditions ?? []).flatMap((condition) => condition?.subConditions ?? []);

  return {
    majorId: toNumberOrNull(majorId),
    minorName: minorName?.trim() || null,
    formulaModel: {
      formId: toNumberOrNull(formId),
      formula: '',
      condition: {
        type: 'group',
        children: subConditions.map((subCondition, index) =>
          buildLiveChild(subCondition, subConditions[index + 1]),
        ),
      },
    },
  };
};

const JSON_TOKEN = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false)\b|\b(null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

const highlightJson = (json: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of json.matchAll(JSON_TOKEN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) nodes.push(json.slice(lastIndex, index));

    const [text, stringToken, colon, booleanToken, nullToken] = match;
    let color = COLORS.number;
    if (stringToken) color = colon ? COLORS.key : COLORS.string;
    else if (booleanToken) color = COLORS.keyword;
    else if (nullToken) color = COLORS.pending;

    nodes.push(
      <span key={index} style={{ color }}>
        {stringToken && colon ? stringToken : text}
      </span>,
    );
    if (stringToken && colon) nodes.push(colon);

    lastIndex = index + text.length;
  }

  if (lastIndex < json.length) nodes.push(json.slice(lastIndex));
  return nodes;
};

const codeStyle = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap' as const,
  wordBreak: 'break-all' as const,
  textAlign: 'left' as const,
  color: COLORS.punctuation,
};

export default function ConditionFormulaDemo({ majorId, minorName, formId, calculatorFormula }: ConditionFormulaDemoProps) {
  const conditions = useWatch({ name: 'conditions' }) as TConditionData[] | undefined;
  const payloadJson = JSON.stringify(buildLivePayload(conditions, majorId, minorName, formId), null, 2);

  return (
    <div
      className="w-full flex flex-col rounded-xl"
      style={{
        marginTop: 12,
        padding: 16,
        gap: 14,
        background: COLORS.background,
        border: `1px solid ${COLORS.border}`,
      }}>
      <div className="flex flex-col" style={{ gap: 6 }}>
        <span style={{ fontSize: 12, color: COLORS.label }}>payload</span>
        <pre dir="ltr" className={styles.code} style={codeStyle}>
          {highlightJson(payloadJson)}
        </pre>
      </div>

      <div className="flex flex-col" style={{ gap: 6, borderTop: `1px dashed ${COLORS.border}`, paddingTop: 12 }}>
        <span style={{ fontSize: 12, color: COLORS.label }}>محاسبه</span>
        <pre dir="ltr" className={styles.code} style={codeStyle}>
          {calculatorFormula ? (
            <span style={{ color: COLORS.string }}>{calculatorFormula}</span>
          ) : (
            <span style={{ color: COLORS.label }}>-</span>
          )}
        </pre>
      </div>
    </div>
  );
}
