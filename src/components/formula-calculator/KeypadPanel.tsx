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
  handleToggleSign: () => void;
  handleUndo: () => void;
  variant?: 'desktop' | 'mobile';
}

const MOBILE_KEYPAD_MAX_WIDTH = 360;
const MOBILE_OPERATOR_WIDTH = 52;

const keepEditorFocus = (event: React.MouseEvent) => {
  event.preventDefault();
};

const TABS = [
  { id: 'numbers' as const, label: 'اعداد' },
  { id: 'functions' as const, label: 'توابع' },
];

const OPERATORS = ['+', '-', '*', '/'];
const POWER_OPERATOR = '^';
const NUMBER_ROWS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
];

const FUNCTION_BUTTONS = [
  { label: 'max', wired: false, span: 1 },
  { label: 'min', wired: false, span: 1 },
  { label: 'میانگین', wired: true, span: 2 },
  { label: 'ABS', wired: false, span: 1 },
  { label: '√', wired: false, span: 1 },
  { label: 'x²', wired: false, span: 1 },
  { label: 'رند', wired: false, span: 1 },
];

function KeypadTabs({
  activeTab,
  onChange,
}: {
  activeTab: KeypadTab;
  onChange: (tab: KeypadTab) => void;
}) {
  return (
    <div className="flex flex-row-reverse items-center justify-center gap-6 border-b border-[#E8E8E8]" style={{ marginBottom: 8 }}>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={clsx(
            'text-xs font-normal transition-colors relative flex-1',
            activeTab === tab.id ? 'text-[#1758BA]' : 'text-[#9EA3AC]',
          )}
          style={{ paddingTop: 5, paddingBottom: 3 }}
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
  isMobile = false,
}: {
  handleParenthesis: (content: string) => void;
  handleUndo: () => void;
  isMobile?: boolean;
}) {
  const parenSizeStyle = isMobile
    ? { width: MOBILE_OPERATOR_WIDTH, maxWidth: MOBILE_OPERATOR_WIDTH, flex: `0 0 ${MOBILE_OPERATOR_WIDTH}px`, fontSize: 15 }
    : undefined;

  return (
    <div className="flex gap-[6px] mb-[6px] w-full">
      <button type="button" className={parenBtnClass} style={parenSizeStyle} onClick={() => handleParenthesis(')')}>
        (
      </button>
      <button type="button" className={parenBtnClass} style={parenSizeStyle} onClick={() => handleParenthesis('(')}>
        )
      </button>
      <button type="button" className={deleteBtnClass} onClick={handleUndo} aria-label="حذف">
        <Image src="/images/calc/arrow-left.svg" width={22} height={22} alt="" unoptimized />
      </button>
    </div>
  );
}

function NumbersTabContent({
  handleParenthesis,
  handleUndo,
  handleNumber,
  handleToggleSign,
  handleOperator,
  isMobile = false,
}: {
  handleParenthesis: (content: string) => void;
  handleUndo: () => void;
  handleNumber: (num: string) => void;
  handleToggleSign: () => void;
  handleOperator: (op: string) => void;
  isMobile?: boolean;
}) {
  const operatorSizeStyle = isMobile ? { width: MOBILE_OPERATOR_WIDTH, fontSize: 15 } : undefined;

  return (
    <>
      <ParenDeleteRow handleParenthesis={handleParenthesis} handleUndo={handleUndo} isMobile={isMobile} />

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

        <div className={clsx('flex flex-col gap-[6px] shrink-0', !isMobile && 'w-9')} style={operatorSizeStyle}>
          {OPERATORS.map((op) => (
            <button
              key={op}
              type="button"
              className={operatorBtnClass}
              style={isMobile ? { fontSize: 15 } : undefined}
              onClick={() => handleOperator(op)}
            >
              {op}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-[6px]" style={{ marginTop: 6 }}>
        <button type="button" className={clsx(numberBtnClass, 'flex-1')} onClick={handleToggleSign} title="مثبت / منفی">
          +/-
        </button>
        <button
          type="button"
          className={clsx(operatorBtnClass, 'shrink-0', !isMobile && 'w-9 max-w-9')}
          style={operatorSizeStyle}
          onClick={() => handleOperator(POWER_OPERATOR)}
          title="توان"
        >
          {POWER_OPERATOR}
        </button>
      </div>
    </>
  );
}

function FunctionsTabContent({
  handleParenthesis,
  handleUndo,
  handleFnFX,
  isMobile = false,
}: {
  handleParenthesis: (content: string) => void;
  handleUndo: () => void;
  handleFnFX: () => void;
  isMobile?: boolean;
}) {
  return (
    <>
      <ParenDeleteRow handleParenthesis={handleParenthesis} handleUndo={handleUndo} isMobile={isMobile} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6 }}>
        {FUNCTION_BUTTONS.map((fn) => (
          <button
            key={fn.label}
            type="button"
            className={fnBtnClass}
            style={{ gridColumn: `span ${fn.span}` }}
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
  handleToggleSign,
  handleUndo,
  variant = 'desktop',
}: KeypadPanelProps) {
  const [activeTab, setActiveTab] = useState<KeypadTab>('numbers');
  const isMobile = variant === 'mobile';

  const tabPaneStyle = (tab: KeypadTab) => ({
    gridArea: '1 / 1',
    visibility: activeTab === tab ? ('visible' as const) : ('hidden' as const),
  });

  const tabContent = (
    <div style={{ display: 'grid' }}>
      <div style={tabPaneStyle('numbers')} aria-hidden={activeTab !== 'numbers'}>
        <NumbersTabContent
          handleParenthesis={handleParenthesis}
          handleUndo={handleUndo}
          handleNumber={handleNumber}
          handleToggleSign={handleToggleSign}
          handleOperator={handleOperator}
          isMobile={isMobile}
        />
      </div>
      <div style={tabPaneStyle('functions')} aria-hidden={activeTab !== 'functions'}>
        <FunctionsTabContent
          handleParenthesis={handleParenthesis}
          handleUndo={handleUndo}
          handleFnFX={handleFnFX}
          isMobile={isMobile}
        />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div
        dir="rtl"
        className="flex flex-col w-full mx-auto px-1 pb-1"
        style={{ maxWidth: MOBILE_KEYPAD_MAX_WIDTH }}
        onMouseDown={keepEditorFocus}>
        <div dir="ltr">
          <KeypadTabs activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <button type="button" className={newFieldBtnClass} onClick={handleNewField}>
          فیلد جدید
        </button>
        {tabContent}
      </div>
    );
  }

  return (
    <div
      dir="ltr"
      className="flex flex-col shrink-0 mr-[48px] w-[164px] min-w-[164px]"
      style={{ marginLeft: 30 }}
      onMouseDown={keepEditorFocus}>
      <KeypadTabs activeTab={activeTab} onChange={setActiveTab} />

      <button type="button" className={newFieldBtnClass} onClick={handleNewField}>
        فیلد جدید
      </button>

      {tabContent}
    </div>
  );
}
