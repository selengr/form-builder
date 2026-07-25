'use client';
import React, { useCallback } from 'react';
import styles from '@/components/calculator/advancedFormulaEditor.module.css';
import { Element } from './types';
import FormulaElement from './FormulaElement';

interface FormulaInputProps {
  elements: Element[];
  questionList: any;
  contentEditableRef: React.RefObject<HTMLDivElement>;
  onFieldSelect: (item: any, id: string, element: any) => void;
  onFieldClick: (e: React.MouseEvent, id: string, index: any) => void;
  onFnSelect: (item: any, id: string) => void;
  onFnClick: (e: React.MouseEvent, id: string) => void;
  onClick: (e: React.MouseEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const FormulaInput: React.FC<FormulaInputProps> = ({ elements, questionList, contentEditableRef, onFieldSelect, onFieldClick, onFnSelect, onFnClick, onClick, onKeyDown }) => {
  const renderElements = useCallback(
    () =>
      elements.map((elem, index) => (
        <FormulaElement
          key={`${elem.type}_${elem.mainIndex ?? index}`}
          element={elem}
          index={index}
          questionList={questionList}
          onFieldSelect={onFieldSelect}
          onFieldClick={onFieldClick}
          onFnSelect={onFnSelect}
          onFnClick={onFnClick}
        />
      )),
    [elements, questionList, onFieldSelect, onFieldClick, onFnSelect, onFnClick],
  );

  return (
    <div contentEditable onClick={onClick} ref={contentEditableRef} onKeyDown={onKeyDown} suppressContentEditableWarning className={styles.ContentEditable}>
      {renderElements()}
    </div>
  );
};

export default FormulaInput;
