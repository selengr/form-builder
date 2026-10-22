'use client';

import { useMemo } from 'react';
import { Box } from '@mui/material';
import styles from '../detail/calculator/formulaEditor.module.css';
import { Element, IFieldQuestionData } from '../detail/calculator/types';
import { getCalculatorFieldId } from '../detail/calculator/utils/getCalculatorFieldId';

interface SavedFormulaPreviewProps {
  elements: Element[];
  formula: string;
  fields: IFieldQuestionData;
  isLoading: boolean;
}

const SCRIPT_BOX_HEIGHT_DESKTOP = 245;
const SCRIPT_BOX_HEIGHT_MOBILE = 161;

const fieldTextStyle = {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  padding: '0 10px',
  overflow: 'hidden',
  whiteSpace: 'nowrap' as const,
  textOverflow: 'ellipsis',
};

export default function SavedFormulaPreview({ elements, formula, fields, isLoading }: SavedFormulaPreviewProps) {
  const fieldNames = useMemo(() => {
    const names: Record<string, string> = {};
    fields.dataList.forEach((item) => {
      const id = getCalculatorFieldId(item);
      if (id) names[id] = item.caption;
    });
    return names;
  }, [fields]);

  const renderElement = (element: Element, index: number) => {
    if (element.type === 'NEW_FIELD') {
      const name = (element.id && fieldNames[element.id]) || element.content;
      return (
        <div key={index} className={`${styles.dynamicbtn} ${styles.NEW_FIELD}`} style={{ cursor: 'default' }} title={name}>
          <span style={fieldTextStyle}>{name}</span>
        </div>
      );
    }

    if (element.type === 'NEW_FnFx') {
      return (
        <div key={index} className={`${styles.dynamicbtn} ${styles.NEW_FnFx}`} style={{ cursor: 'default' }}>
          <span style={fieldTextStyle}>میانگین</span>
        </div>
      );
    }

    return (
      <div
        key={index}
        dir={element.type === 'NUMBER' ? 'ltr' : undefined}
        className={`${styles.dynamicbtn} ${styles[element.type]}`}>
        {element.content}
      </div>
    );
  };

  return (
    <div dir="rtl" className="flex flex-col w-full">
      <label className="block text-[13px] md:text-sm font-medium text-[#161616]" style={{ marginBottom: 14 }}>
        فرمول:
      </label>

      <Box
        className="w-full rounded-[20px] border border-[#DDE1E6] bg-[#F8FAFC] p-3 overflow-y-auto"
        sx={{ height: { xs: SCRIPT_BOX_HEIGHT_MOBILE, md: SCRIPT_BOX_HEIGHT_DESKTOP }, scrollbarWidth: 'thin' }}>
        {isLoading ? (
          <span className="text-[13px] text-[#9EA3AC]">در حال بارگذاری...</span>
        ) : elements.length ? (
          elements.map(renderElement)
        ) : (
          <span className="text-[13px] text-[#9EA3AC]">هنوز فرمولی برای این فرمول ثبت نشده است.</span>
        )}
      </Box>

      <div
        dir="ltr"
        title={formula}
        className={`${styles.formulaPreview} relative shrink-0 rounded-[10px] border border-[#DDE1E6] bg-[#F4F5F7]`}
        style={{ marginTop: 8, height: 34, fontSize: 13 }}>
        <div
          className="absolute flex items-center"
          style={{ inset: 0, padding: '0 12px', gap: 8, overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap', scrollbarWidth: 'thin' }}>
          <span style={{ color: '#9EA3AC', fontSize: 11, flexShrink: 0 }}>formula</span>
          {formula ? (
            <span style={{ color: '#1758BA', flexShrink: 0 }}>{formula}</span>
          ) : (
            <span style={{ color: '#C1C7CD' }}>—</span>
          )}
        </div>
      </div>
    </div>
  );
}
