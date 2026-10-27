'use client';

import { useCallback, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { FormulaCalculator, type IFieldQuestionData } from '@/components/formula-calculator';
import type { IFieldQuestionData as BuilderFieldData } from '@/types/calculator';
import { fetchCalculatorsAction } from '../../../actions/calculator/calculator';
import BuilderCalculatorProbe from './BuilderCalculatorProbe';

const DEMO_FIELDS = {
  dataList: [
    { value: '1', caption: 'سوال اول', elementStr: 'q1', extMap: { UNIC_NAME: '{#q_first}', QUESTION_TYPE: 'TEXT_FIELD' } },
    { value: '2', caption: 'سوال دوم', elementStr: 'q2', extMap: { UNIC_NAME: '{#q_second}', QUESTION_TYPE: 'TEXT_FIELD' } },
    { value: '3', caption: 'سوال سوم', elementStr: 'q3', extMap: { UNIC_NAME: '{#q_third}', QUESTION_TYPE: 'TEXT_FIELD' } },
  ],
  totalCount: 3,
  page: 0,
  rows: 10,
};

const codeStyle = {
  margin: 0,
  padding: '10px 12px',
  borderRadius: 10,
  background: '#F4F5F7',
  border: '1px solid #DDE1E6',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  fontSize: 13,
  whiteSpace: 'pre-wrap' as const,
  wordBreak: 'break-all' as const,
  direction: 'ltr' as const,
  textAlign: 'left' as const,
  minHeight: 38,
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col w-full rounded-[20px] border border-[#DDE1E6] bg-white" style={{ padding: 16, gap: 12 }}>
      <h2 className="text-[15px] font-bold text-[#161616]">{title}</h2>
      {children}
    </section>
  );
}

export default function CalculatorCompare() {
  const formId = useSearchParams().get('formId') ?? '';
  const [builderFormula, setBuilderFormula] = useState('');
  const [newFormula, setNewFormula] = useState('');
  const handleBuilderFormula = useCallback((formula: string) => setBuilderFormula(formula), []);
  const handleNewFormula = useCallback((formula: string) => setNewFormula(formula), []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['calculator-compare-fields', formId],
    queryFn: async () => {
      const res = await fetchCalculatorsAction(formId);
      if (!res.success) throw new Error(res.message || 'خطا در دریافت سوالات فرم');
      return res.data as BuilderFieldData;
    },
    enabled: Boolean(formId),
  });

  const fields = formId ? data : (DEMO_FIELDS as unknown as BuilderFieldData);
  const bothEmpty = !builderFormula && !newFormula;
  const isSame = builderFormula === newFormula;

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[#F8FAFC]" style={{ padding: 16 }}>
      <div className="flex flex-col w-full mx-auto" style={{ maxWidth: 1100, gap: 16 }}>
        <Card title="مقایسه‌ی رشته‌ی فرمول">
          <span className="text-[12px] text-[#6F7782]">
            {formId
              ? `سوالات فرم ${formId} (همان API بیلدر)`
              : 'سوالات نمونه با نام {#q_...} — برای سوالات واقعی یک فرم، آدرس را با ?formId=شناسه‌ی فرم باز کنید'}
          </span>
          <div className="text-[12px] text-[#6F7782]">ماشین‌حساب بیلدر:</div>
          <pre style={codeStyle}>{builderFormula || '—'}</pre>
          <div className="text-[12px] text-[#6F7782]">ماشین‌حساب جدید:</div>
          <pre style={codeStyle}>{newFormula || '—'}</pre>
          <div
            className="text-[13px] font-bold rounded-[10px] text-center"
            style={{
              padding: 8,
              color: bothEmpty ? '#6F7782' : isSame ? '#2F855A' : '#FA4D56',
              background: bothEmpty ? '#F4F5F7' : isSame ? '#ECFDF5' : '#FFF5F5',
            }}>
            {bothEmpty ? 'هنوز فرمولی ساخته نشده' : isSame ? 'یکسان ✓' : 'متفاوت ✗'}
          </div>
        </Card>

        {formId && isLoading && <p className="text-center text-[13px] text-[#6F7782]">در حال دریافت سوالات فرم...</p>}
        {formId && error && <p className="text-center text-[13px] text-[#FA4D56]">{(error as Error).message}</p>}

        {fields && (
          <>
            <Card title="ماشین‌حساب بیلدر (components/calculator)">
              <BuilderCalculatorProbe questionList={fields} handleClose={() => {}} onFormulaChange={handleBuilderFormula} />
              <pre style={codeStyle}>{builderFormula || '—'}</pre>
            </Card>

            <Card title="ماشین‌حساب جدید (components/formula-calculator)">
              <FormulaCalculator
                fields={fields as unknown as IFieldQuestionData}
                onFormulaChange={handleNewFormula}
                showFormulaPreview
                scriptLayout="stretch"
              />
              <pre style={codeStyle}>{newFormula || '—'}</pre>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
