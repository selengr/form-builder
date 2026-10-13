'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './formulaEditor.module.css';
import { Element } from './types';
import { getCalculatorFieldId } from './utils/getCalculatorFieldId';

interface FormulaFieldDropdownProps {
  element: Element;
  options: any[];
  emptyText: string;
  onSelect: (item: any, id: string, element: any) => void;
  onClick: (e: React.MouseEvent, id: string, index: any) => void;
}

const FormulaFieldDropdown: React.FC<FormulaFieldDropdownProps> = ({ element, options, emptyText, onSelect, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (item: any) => {
    onSelect(item, element.id!, element);
    setIsOpen(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownClick = (e: React.MouseEvent) => {
    onClick(e, element.id!, element.mainIndex);
    setIsOpen((prev) => !prev);
  };

  const returnCaption = () => {
    const match = options.find((item) => getCalculatorFieldId(item) === element.id);
    return match?.caption || "انتخاب سوال";
  };

  return (
    <div ref={dropdownRef} data-id={element.mainIndex} contentEditable={false} className={`${styles.dynamicbtn} ${styles.NEW_FIELD}`} data-type='NEW_FIELD'>
      <div className={styles.customDropdown} data-type='down' onClick={handleDropdownClick}>
        {returnCaption()}
      </div>
      {isOpen && (
        <div className={styles.optionsContainer} style={{ display: 'block' }}>
          {options.length === 0 && (
            <div style={{ color: '#6F6F6F', fontSize: 12, textAlign: 'center', padding: '8px 4px' }}>{emptyText}</div>
          )}
          {options.map((item, index) => (
            <div key={index} className={styles.option} onClick={() => handleOptionClick(item)}>
              {item.caption}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormulaFieldDropdown;
