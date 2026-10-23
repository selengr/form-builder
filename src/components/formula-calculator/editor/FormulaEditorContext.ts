import { createContext, useContext } from 'react';
import type React from 'react';
import { Element, FnFxItem, IFieldQuestionData } from '../types';

export type TokenSide = 'before' | 'after';

export interface FormulaEditorContextValue {
  fields: IFieldQuestionData;
  onFieldSelect: (item: any, id: string, element: Element) => void;
  onFieldClick: (event: React.MouseEvent, id: string, index: any) => void;
  onFnSelect: (item: FnFxItem, id: string) => void;
  onFnClick: (event: React.MouseEvent, id: string) => void;
  onTokenPress: (index: number, side: TokenSide) => void;
}

export const FormulaEditorContext = createContext<FormulaEditorContextValue | null>(null);

export const useFormulaEditorContext = () => {
  const value = useContext(FormulaEditorContext);
  if (!value) throw new Error('FormulaEditorContext is missing');
  return value;
};
