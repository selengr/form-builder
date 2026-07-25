'use client';

import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import {
  deleteBtnClass,
  fnBtnClass,
  newFieldBtnClass,
  numberBtnClass,
  operatorBtnClass,
  parenBtnClass,
} from './keypadStyles';

type KeypadTab = 'numbers' | 'functions';

interface KeypadPanelProps {
  handleFnFX: () => void;
  handleNewField: () => void;
  handleParenthesis: (content: string) => void;
  handleOperator: (op: string) => void;
  handleNumber: (num: string) => void;
  handleUndo: () => void;
  contentEditable: React.RefObject<HTMLDivElement>;
  variant?: 'desktop' | 'mobile';
}

const TABS = [
  { id: 'numbers' as const, label: 'اعداد' },
  { id: 'functions' as const, label: 'توابع' },
];

const OPERATORS = ['+', '-', '*', '/'];
const NUMBER_ROWS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
];

/** Visual-only function labels — logic not wired in this stage */
const FUNCTION_BUTTONS = [
  { label: 'max', wired: false },
  { label: 'min', wired: false },
  { label: 'میانگین', wired: true },
  { label: 'ABS', wired: false },
  { label: '√', wired: false },
  { label: 'x²', wired: false },
  { label: 'رند', wired: false },
];

function KeypadTabs({
  activeTab,
  onChange,
  mobile = false,
}: {
  activeTab: KeypadTab;
  onChange: (tab: KeypadTab) => void;
  mobile?: boolean;
}) {
  if (mobile) {
    return (
      <div className="flex flex-col gap-1.5 p-1.5 rounded-2xl bg-[#F7F7FF] h-full shrink-0 w-[90px]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={clsx(
              'h-[36px] rounded-xl text-[11px] leading-tight transition-all duration-200 px-3',
              activeTab === tab.id
                ? 'bg-white text-[#1758BA] shadow-sm font-semibold'
                : 'text-[#8A9099] font-normal',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-row-reverse items-center justify-center gap-6 mb-3 border-b border-[#E8E8E8]">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={clsx(
            'pb-2 text-xs font-normal transition-colors relative flex-1',
            activeTab === tab.id ? 'text-[#1758BA]' : 'text-[#9EA3AC]',
          )}
        >
          {tab.label}
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1758BA] rounded-t-full" />
          )}
        </button>
      ))}
    </div>
  );
}

function ParenDeleteRow({
  handleParenthesis,
  handleUndo,
}: {
  handleParenthesis: (content: string) => void;
  handleUndo: () => void;
}) {
  return (
    <div className="flex gap-[6px] mb-[6px] w-full">
      <button type="button" className={parenBtnClass} onClick={() => handleParenthesis(')')}>
        (
      </button>
      <button type="button" className={parenBtnClass} onClick={() => handleParenthesis('(')}>
        )
      </button>
      <button type="button" className={deleteBtnClass} onClick={handleUndo} aria-label="حذف">
        <Image src="/images/calc/arrow-left.svg" width={22} height={22} alt="" />
      </button>
    </div>
  );
}

function NumbersTabContent({
  handleParenthesis,
  handleUndo,
  handleNumber,
  handleOperator,
}: {
  handleParenthesis: (content: string) => void;
  handleUndo: () => void;
  handleNumber: (num: string) => void;
  handleOperator: (op: string) => void;
}) {
  return (
    <>
      <ParenDeleteRow handleParenthesis={handleParenthesis} handleUndo={handleUndo} />

      <div className="flex gap-[6px]">
        <div className="flex-1 flex flex-col gap-[6px] min-w-0">
          {NUMBER_ROWS.map((row) => (
            <div key={row.join('-')} className="flex gap-[6px]">
              {row.map((num) => (
                <button
                  key={num}
                  type="button"
                  className={clsx(numberBtnClass, 'flex-1')}
                  onClick={() => handleNumber(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          ))}
          <div className="flex gap-[6px]">
            <button
              type="button"
              className={clsx(numberBtnClass, 'flex-[2]')}
              onClick={() => handleNumber('0')}
            >
              0
            </button>
            <button
              type="button"
              className={clsx(numberBtnClass, 'flex-1 w-9 md:max-w-9')}
              onClick={() => handleNumber('.')}
            >
              .
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-[6px] w-9 shrink-0">
          {OPERATORS.map((op) => (
            <button
              key={op}
              type="button"
              className={operatorBtnClass}
              onClick={() => handleOperator(op)}
            >
              {op}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function FunctionsTabContent({
  handleParenthesis,
  handleUndo,
  handleFnFX,
}: {
  handleParenthesis: (content: string) => void;
  handleUndo: () => void;
  handleFnFX: () => void;
}) {
  return (
    <>
      <ParenDeleteRow handleParenthesis={handleParenthesis} handleUndo={handleUndo} />

      <div className="grid grid-cols-3 gap-[6px]">
        {FUNCTION_BUTTONS.map((fn) => (
          <button
            key={fn.label}
            type="button"
            className={fnBtnClass}
            onClick={fn.wired ? handleFnFX : undefined}
            title={fn.wired ? undefined : 'به‌زودی'}
          >
            {fn.label}
          </button>
        ))}
      </div>
    </>
  );
}

export default function KeypadPanel({
  handleFnFX,
  handleNewField,
  handleParenthesis,
  handleOperator,
  handleNumber,
  handleUndo,
  variant = 'desktop',
}: KeypadPanelProps) {
  const [activeTab, setActiveTab] = useState<KeypadTab>('numbers');
  const isMobile = variant === 'mobile';

  const tabContent =
    activeTab === 'numbers' ? (
      <NumbersTabContent
        handleParenthesis={handleParenthesis}
        handleUndo={handleUndo}
        handleNumber={handleNumber}
        handleOperator={handleOperator}
      />
    ) : (
      <FunctionsTabContent
        handleParenthesis={handleParenthesis}
        handleUndo={handleUndo}
        handleFnFX={handleFnFX}
      />
    );

  if (isMobile) {
    return (
      <div dir="rtl" className="flex flex-row gap-3 w-full max-w-[320px] mx-2 px-1 pb-1">
        <KeypadTabs activeTab={activeTab} onChange={setActiveTab} mobile />

        <div className="flex-1 flex flex-col w-[200px] min-w-[200px] min-h-[246px]">
          <button type="button" className={newFieldBtnClass} onClick={handleNewField}>
            فیلد جدید
          </button>
          {tabContent}
        </div>
      </div>
    );
  }

  return (
    <div dir="ltr" className="flex flex-col shrink-0 mr-[48px] ml-[28px] w-[164px] min-w-[164px]">
      <KeypadTabs activeTab={activeTab} onChange={setActiveTab} />

      <button type="button" className={newFieldBtnClass} onClick={handleNewField}>
        فیلد جدید
      </button>

      {tabContent}
    </div>
  );
}
