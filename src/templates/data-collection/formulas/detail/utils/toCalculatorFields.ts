import type { IFieldDataItem, IFieldQuestionData } from '@/components/formula-calculator';
import { MinorFormulaListItem } from '../types';

const toMinorFieldId = (id: number) => `{#minor_${id}}`;

export const toCalculatorFields = (minorList: MinorFormulaListItem[]): IFieldQuestionData => ({
  dataList: minorList.map((item, index) => ({
    value: String(item.id),
    caption: item.minorName?.trim() || `فرمول ${(index + 1).toLocaleString('fa-IR')}`,
    elementStr: toMinorFieldId(item.id),
    extMap: {} as IFieldDataItem['extMap'],
  })),
});
