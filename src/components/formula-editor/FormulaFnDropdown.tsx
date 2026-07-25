'use client';
import React from 'react';
import styles from '@/components/calculator/advancedFormulaEditor.module.css';
import { Element, FnFxItem } from './types';

interface FormulaFnDropdownProps {
  element: Element;
  options: FnFxItem[];
  onSelect: (item: FnFxItem, id: string) => void;
  onClick: (e: React.MouseEvent, id: string) => void;
}

const FormulaFnDropdown: React.FC<FormulaFnDropdownProps> = ({ element, options, onSelect, onClick }) => {
  return (
    <div key={element.id} data-id={element.id} contentEditable={false} className={`${styles.dynamicbtn} ${styles.NEW_FnFx}`} data-type='NEW_FnFx'>
      <div className={styles.customDropdown} data-type='down' onClick={(e) => onClick(e, element.id!)}>
        {element.content}
      </div>
      <div className={styles.optionsContainer} style={{ display: 'none' }}>
        {options.map((item) => (
          <div key={item.fnValue} className={styles.option} onClick={() => onSelect(item, element.id!)}>
            {item.fnCaption}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormulaFnDropdown;
