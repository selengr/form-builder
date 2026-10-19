import { MinorFormulaListItem } from '../../types';
import { IFieldDataItem, IFieldQuestionData } from '../types';

export const toCalculatorFields = (minorList: MinorFormulaListItem[]): IFieldQuestionData => ({
  dataList: minorList.map((item, index) => ({
    value: String(item.id),
    caption: item.minorName?.trim() || `فرمول ${(index + 1).toLocaleString('fa-IR')}`,
    elementStr: String(item.id),
    extMap: {} as IFieldDataItem['extMap'],
  })),
});
