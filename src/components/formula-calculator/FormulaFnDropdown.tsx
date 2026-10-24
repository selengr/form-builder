'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './formulaCalculator.module.css';
import { Element, FnFxItem } from './types';
import { useDropdownPlacement } from './useDropdownPlacement';

interface FormulaFnDropdownProps {
  element: Element;
  options: FnFxItem[];
  onSelect: (item: FnFxItem, id: string) => void;
  onClick: (e: React.MouseEvent, id: string) => void;
}

const FormulaFnDropdown: React.FC<FormulaFnDropdownProps> = ({ element, options, onSelect, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const placementStyle = useDropdownPlacement(dropdownRef, listRef, isOpen, 160, 160);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleDropdownClick = (e: React.MouseEvent) => {
    onClick(e, element.id!);
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (item: FnFxItem) => {
    onSelect(item, element.id!);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} key={element.id} data-id={element.id} contentEditable={false} className={`${styles.dynamicbtn} ${styles.NEW_FnFx}`} data-type='NEW_FnFx'>
      <div className={styles.customDropdown} data-type={isOpen ? 'up' : 'down'} onClick={handleDropdownClick}>
        {element.content}
      </div>
      {isOpen && (
        <div ref={listRef} className={styles.optionsContainer} style={{ display: 'block', ...placementStyle }}>
          {options.map((item) => (
            <div key={item.fnValue} className={styles.option} onClick={() => handleOptionClick(item)}>
              {item.fnCaption}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormulaFnDropdown;
