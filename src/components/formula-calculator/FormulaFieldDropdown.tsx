'use client';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './formulaCalculator.module.css';
import { Element } from './types';
import { getCalculatorFieldId } from './utils/getCalculatorFieldId';

interface FormulaFieldDropdownProps {
  element: Element;
  options: any[];
  onSelect: (item: any, id: string, element: any) => void;
  onClick: (e: React.MouseEvent, id: string, index: any) => void;
}

const LIST_MAX_HEIGHT = 240;
const LIST_GAP = 2;
const VIEWPORT_MARGIN = 8;
const CLOSE_ANIMATION_MS = 120;

interface ListPosition {
  top: number;
  right: number;
  maxHeight: number;
  maxWidth: number;
  placement: 'down' | 'up';
}

const FormulaFieldDropdown: React.FC<FormulaFieldDropdownProps> = ({ element, options = [], onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [position, setPosition] = useState<ListPosition | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedIndex = options.findIndex((item) => getCalculatorFieldId(item) === element.id);
  const caption = selectedIndex === -1 ? 'انتخاب سوال' : options[selectedIndex]?.caption || 'انتخاب سوال';

  const close = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setPosition(null);
    }, CLOSE_ANIMATION_MS);
  }, []);

  const open = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsClosing(false);
    setActiveIndex(selectedIndex);
    setIsOpen(true);
  };

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  const updatePosition = useCallback(() => {
    const anchor = dropdownRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const scrollParent = anchor.closest('[class*="overflow-y-auto"]');
    const parentRect = scrollParent?.getBoundingClientRect();
    const isOutOfView =
      rect.bottom < 0 ||
      rect.top > viewportHeight ||
      (parentRect && (rect.bottom < parentRect.top || rect.top > parentRect.bottom));
    if (isOutOfView) {
      close();
      return;
    }

    const listHeight = Math.min(listRef.current?.scrollHeight ?? LIST_MAX_HEIGHT, LIST_MAX_HEIGHT);
    const spaceBelow = viewportHeight - rect.bottom - LIST_GAP - VIEWPORT_MARGIN;
    const spaceAbove = rect.top - LIST_GAP - VIEWPORT_MARGIN;
    const placement = spaceBelow >= listHeight || spaceBelow >= spaceAbove ? 'down' : 'up';
    const available = placement === 'down' ? spaceBelow : spaceAbove;
    const maxHeight = Math.max(Math.min(LIST_MAX_HEIGHT, available), 80);
    const height = Math.min(listHeight, maxHeight);

    const maxWidth = Math.min(240, viewportWidth - VIEWPORT_MARGIN * 2);
    const listWidth = Math.min(listRef.current?.offsetWidth ?? 130, maxWidth);
    let right = viewportWidth - rect.right - 10;
    right = Math.min(right, viewportWidth - listWidth - VIEWPORT_MARGIN);
    right = Math.max(right, VIEWPORT_MARGIN);

    const top = placement === 'down' ? rect.bottom + LIST_GAP : rect.top - LIST_GAP - height;

    setPosition({ top, right, maxHeight, maxWidth, placement });
  }, [close]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePosition();
  }, [isOpen, options.length, updatePosition]);

  useLayoutEffect(() => {
    if (!isOpen || !position || !listRef.current) return;
    const list = listRef.current;
    const option = list.querySelectorAll<HTMLElement>('[role="option"]')[activeIndex];
    if (!option) return;
    if (option.offsetTop < list.scrollTop) {
      list.scrollTop = option.offsetTop - 6;
    } else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight + 6;
    }
  }, [isOpen, position, activeIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current?.contains(target) || listRef.current?.contains(target)) return;
      close();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        close();
        return;
      }
      if (!options.length) return;
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        event.stopPropagation();
        const step = event.key === 'ArrowDown' ? 1 : -1;
        setActiveIndex((current) => (current + step + options.length) % options.length);
      } else if (event.key === 'Enter' && activeIndex >= 0 && options[activeIndex]) {
        event.preventDefault();
        event.stopPropagation();
        handleOptionClick(options[activeIndex]);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeIndex, options, close, updatePosition]);

  const handleOptionClick = (item: any) => {
    onSelect(item, element.id!, element);
    close();
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen && !isClosing) close();
    else open();
  };

  const isExpanded = isOpen && !isClosing;

  return (
    <div ref={dropdownRef} data-id={element.mainIndex} contentEditable={false} className={`${styles.dynamicbtn} ${styles.NEW_FIELD}`} data-type='NEW_FIELD'>
      <div
        className={styles.customDropdown}
        data-type={isExpanded ? 'up' : 'down'}
        title={caption}
        role="combobox"
        aria-expanded={isExpanded}
        aria-haspopup="listbox"
        onClick={handleDropdownClick}>
        {caption}
      </div>
      {isOpen &&
        createPortal(
          <div
            ref={listRef}
            dir="rtl"
            role="listbox"
            className={`${styles.fieldOptions} ${isClosing ? styles.fieldOptionsClosing : ''}`}
            data-placement={position?.placement ?? 'down'}
            style={{
              top: position?.top ?? 0,
              right: position?.right ?? 0,
              maxHeight: position?.maxHeight ?? LIST_MAX_HEIGHT,
              maxWidth: position?.maxWidth ?? 240,
              visibility: position ? 'visible' : 'hidden',
            }}
            onMouseDown={(event) => event.preventDefault()}>
            {options.length === 0 ? (
              <div className={styles.fieldOptionsEmpty}>سوالی برای انتخاب وجود ندارد</div>
            ) : (
              options.map((item, index) => (
                <div
                  key={index}
                  role="option"
                  aria-selected={index === selectedIndex}
                  title={item.caption}
                  className={styles.fieldOption}
                  data-active={index === activeIndex || undefined}
                  data-selected={index === selectedIndex || undefined}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => handleOptionClick(item)}>
                  {item.caption}
                </div>
              ))
            )}
          </div>,
          document.body,
        )}
    </div>
  );
};

export default FormulaFieldDropdown;
