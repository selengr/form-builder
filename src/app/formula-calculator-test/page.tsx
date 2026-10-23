'use client';

import { useCallback, useRef, useState } from 'react';
import OldCalculator, { CalculatorSectionHandle } from '@/templates/data-collection/formulas/detail/calculator/CalculatorSection';
import type { IFieldQuestionData as OldFields } from '@/templates/data-collection/formulas/detail/calculator/types';
import { FormulaCalculator, type FormulaCalculatorHandle, type IFieldQuestionData } from '@/components/formula-calculator';

const DEMO_FIELDS = {
  dataList: [
    { value: '301', caption: 'فرمول جزئی ۱', elementStr: '{#minor_301}', extMap: {} },
    { value: '302', caption: 'فرمول جزئی ۲', elementStr: '{#minor_302}', extMap: {} },
    { value: '303', caption: 'فرمول جزئی ۳', elementStr: '{#minor_303}', extMap: {} },
  ],
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

type Result = { formula: string; frontCalcData: string } | null | undefined;

function ResultBox({ result }: { result: Result }) {
  if (result === undefined) return null;
  return (
    <pre style={{ ...codeStyle, marginTop: 8 }}>
      {result === null ? 'getResult() → null (see the toast)' : JSON.stringify(result, null, 2)}
    </pre>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col w-full rounded-[20px] border border-[#DDE1E6] bg-white" style={{ padding: 16, gap: 12 }}>
      <h2 className="text-[15px] font-bold text-[#161616]">{title}</h2>
      {children}
    </section>
  );
}

export default function FormulaCalculatorTestPage() {
  const oldRef = useRef<CalculatorSectionHandle>(null);
  const newRef = useRef<FormulaCalculatorHandle>(null);
  const [oldFormula, setOldFormula] = useState('');
  const [newFormula, setNewFormula] = useState('');
  const [oldResult, setOldResult] = useState<Result>(undefined);
  const [newResult, setNewResult] = useState<Result>(undefined);

  const handleOldFormula = useCallback((formula: string) => setOldFormula(formula), []);
  const handleNewFormula = useCallback((formula: string) => setNewFormula(formula), []);

  const bothEmpty = !oldFormula && !newFormula;
  const isSame = oldFormula === newFormula;

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[#F8FAFC]" style={{ padding: 16 }}>
      <div className="flex flex-col w-full mx-auto" style={{ maxWidth: 1100, gap: 16 }}>
        <Card title="مقایسه‌ی فرمول‌ها">
          <span className="text-[12px] text-[#6F7782]">
            یک فرمول یکسان را در هر دو ماشین‌حساب بسازید. اگر رشته‌ها یکی باشند، این قسمت سبز می‌شود.
          </span>
          <div className="text-[12px] text-[#6F7782]">قدیمی:</div>
          <pre style={codeStyle}>{oldFormula || '—'}</pre>
          <div className="text-[12px] text-[#6F7782]">جدید (Tiptap):</div>
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

        <Card title="ماشین‌حساب قدیمی (detail/calculator)">
          <OldCalculator
            ref={oldRef}
            questionList={DEMO_FIELDS as unknown as OldFields}
            onFormulaChange={handleOldFormula}
          />
          <button
            type="button"
            onClick={() => setOldResult(oldRef.current?.getResult())}
            className="self-start rounded-[10px] bg-[#1758BA] text-white text-[13px]"
            style={{ padding: '8px 16px' }}>
            getResult()
          </button>
          <ResultBox result={oldResult} />
        </Card>

        <Card title="ماشین‌حساب جدید (components/formula-calculator — Tiptap)">
          <FormulaCalculator
            ref={newRef}
            fields={DEMO_FIELDS as unknown as IFieldQuestionData}
            onFormulaChange={handleNewFormula}
            showFormulaPreview
            scriptLayout="stretch"
          />
          <button
            type="button"
            onClick={() => setNewResult(newRef.current?.getResult())}
            className="self-start rounded-[10px] bg-[#1758BA] text-white text-[13px]"
            style={{ padding: '8px 16px' }}>
            getResult()
          </button>
          <ResultBox result={newResult} />
        </Card>
      </div>
    </div>
  );
}
