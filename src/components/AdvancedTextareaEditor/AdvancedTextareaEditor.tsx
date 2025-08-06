'use client';
// React & Libs
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
// styles
import styles from './advancedTextareaEditor.module.css';
// types
import { IAdvancedTextareaEditorProps, IDropdownItem, IInitialData } from './types';
import { IConditionQuestionType } from '@/types/conditionReportSolo';

export default function AdvancedTextareaEditor({ initialData, hasError, qacWithOutFilter, onDataChange, label, validationErrors = [] }: IAdvancedTextareaEditorProps) {
  const [dropdowns, setDropdowns] = useState<IDropdownItem[]>([]);
  const [dropdownCounter, setDropdownCounter] = useState<number>(0);

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData && editorRef.current) {
      initializeEditorWithData(initialData);
    }
  }, [initialData]);

  const closeAllDropdowns = useCallback(() => {
    const allOptionsContainers = document.querySelectorAll(`.${styles.optionsContainer}`);
    const allDropdownButtons = document.querySelectorAll(`.${styles.customDropdown}`);

    allOptionsContainers.forEach((container) => {
      (container as HTMLElement).style.display = 'none';
    });

    allDropdownButtons.forEach((button) => {
      button.setAttribute('data-type', 'down');
    });
  }, []);

  const initializeEditorWithData = useCallback((data: IInitialData) => {
    if (!editorRef.current) return;

    editorRef.current.innerHTML = '';
    setDropdowns([]);
    setDropdownCounter(0);

    const sortedDropdowns = [...data.dropdowns].sort((a, b) => a.position - b.position);

    let currentPosition = 0;
    const newDropdowns: IDropdownItem[] = [];
    let counter = 0;

    sortedDropdowns.forEach((dropdownData, index) => {
      const textBefore = data.content.substring(currentPosition, dropdownData.position);
      if (textBefore) {
        const textNode = document.createTextNode(textBefore);
        editorRef.current!.appendChild(textNode);
      }

      const newDropdown: IDropdownItem = {
        id: `dropdown-${counter}`,
        value: dropdownData.value,
        unique_name: dropdownData.unique_name,
        placeholder: 'انتخاب كنيد',
      };

      newDropdowns.push(newDropdown);

      const dropdownContainer = document.createElement('span');
      dropdownContainer.className = 'dropdown-container';
      dropdownContainer.setAttribute('data-dropdown-id', newDropdown.id);
      dropdownContainer.contentEditable = 'false';
      dropdownContainer.style.cssText = `
      display: inline-block;
      margin: 0 2px;
      vertical-align: middle;
    `;

      editorRef.current!.appendChild(dropdownContainer);

      currentPosition = dropdownData.position + dropdownData.value.length + 1;
      counter++;
    });

    const remainingText = data.content.substring(currentPosition);
    if (remainingText) {
      const textNode = document.createTextNode(remainingText);
      editorRef.current!.appendChild(textNode);
    }

    setDropdowns(newDropdowns);
    setDropdownCounter(counter);
  }, []);

  const addDropdown = useCallback(() => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const allDropdownButtons = document.querySelectorAll(`.${styles.customDropdown}`);

    allDropdownButtons.forEach((button) => {
      if (button.getAttribute('data-type') === 'up') {
        const selection = window.getSelection();
        if (!selection || !editorRef.current) return;
        const range = selection.getRangeAt(0);
        editorRef.current.focus();
        range.deleteContents();
        closeAllDropdowns();
      }
    });

    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;

    const newDropdown: IDropdownItem = {
      id: `dropdown-${dropdownCounter}`,
      value: '',
      unique_name: '',
      placeholder: 'انتخاب كنيد',
    };

    setDropdowns((prev) => [...prev, newDropdown]);

    const dropdownContainer = document.createElement('span');
    dropdownContainer.className = 'dropdown-container';
    dropdownContainer.setAttribute('data-dropdown-id', newDropdown.id);
    dropdownContainer.contentEditable = 'false';
    dropdownContainer.style.cssText = `
      display: inline-block;
      margin: 0 2px;
      vertical-align: middle;
    `;

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(dropdownContainer);

    range.setStartAfter(dropdownContainer);
    range.setEndAfter(dropdownContainer);
    selection.removeAllRanges();
    selection.addRange(range);

    setDropdownCounter((prev) => prev + 1);
    editorRef.current.focus();
  }, [dropdownCounter]);

  const updateDropdownValue = useCallback((dropdownId: string, value: string, unique_name: string) => {
    setDropdowns((prev) =>
      prev.map((dropdown) =>
        dropdown.id === dropdownId
          ? {
              ...dropdown,
              value,
              unique_name,
            }
          : dropdown,
      ),
    );

    const optionsContainer = document.querySelector(`[data-id="${dropdownId}"] .${styles.optionsContainer}`) as HTMLElement;
    if (optionsContainer) {
      optionsContainer.style.display = 'none';
    }

    const dropdownButton = document.querySelector(`[data-id="${dropdownId}"] .${styles.customDropdown}`) as HTMLElement;
    if (dropdownButton) {
      dropdownButton.setAttribute('data-type', 'down');
    }
  }, []);

  const removeDropdown = useCallback((dropdownId: string) => {
    setDropdowns((prev) => prev.filter((d) => d.id !== dropdownId));

    if (editorRef.current) {
      const dropdownElement = editorRef.current.querySelector(`[data-dropdown-id="${dropdownId}"]`);
      if (dropdownElement) {
        dropdownElement.remove();
      }
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Escape') {
        const selection = window.getSelection();
        if (!selection || !editorRef.current) return;

        const range = selection.getRangeAt(0);
        const { startContainer, startOffset } = range;

        if (e.key === 'Backspace') {
          const prevSibling = startContainer.nodeType === Node.TEXT_NODE ? (startOffset === 0 ? startContainer.previousSibling : null) : startContainer.previousSibling;

          if (prevSibling && (prevSibling as Element).classList?.contains('dropdown-container')) {
            e.preventDefault();
            const dropdownId = (prevSibling as Element).getAttribute('data-dropdown-id');
            if (dropdownId) {
              removeDropdown(dropdownId);
            }
            return;
          }
        }

        if (e.key === 'Delete') {
          const nextSibling = startContainer.nodeType === Node.TEXT_NODE ? (startOffset === startContainer.textContent?.length ? startContainer.nextSibling : null) : startContainer.nextSibling;

          if (nextSibling && (nextSibling as Element).classList?.contains('dropdown-container')) {
            e.preventDefault();
            const dropdownId = (nextSibling as Element).getAttribute('data-dropdown-id');
            if (dropdownId) {
              removeDropdown(dropdownId);
            }
            return;
          }
        }
        if (e.key === 'Escape') {
          closeAllDropdowns();
        }
      }
    },
    [removeDropdown],
  );

  const handleInput = () => {
    if (onDataChange) {
      const formData = generateFormData();
      onDataChange(formData);
    }
  };

  const handleDropdownClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const optionsContainer = (e.target as HTMLElement).nextElementSibling as HTMLElement;
    const isHidden = optionsContainer.style.display === 'none';
    optionsContainer.style.display = isHidden ? 'block' : 'none';
    (e.target as HTMLElement).setAttribute('data-type', isHidden ? 'up' : 'down');
  };

  //new
  const renderDropdowns = useCallback(() => {
    if (!editorRef.current) return null;

    return dropdowns.map((dropdown) => {
      const container = editorRef.current?.querySelector(`[data-dropdown-id="${dropdown.id}"]`);

      const hasErrors = validationErrors.includes(dropdown.id);

      if (!container) return null;

      return createPortal(
        <div className='flex justify-center items-center gap-1 bg-white rounded-md p-1'>
          <div key={dropdown.id} data-id={dropdown.id} contentEditable={false} className={`${styles.dynamicbtn} ${styles.NEW_FIELD}  ${hasErrors ? styles.NEW_FIELD_ERROR : ''}`} data-type='NEW_FIELD'>
            <div className={styles.customDropdown} data-type='down' onClick={(e) => handleDropdownClick(e, dropdown.id!)}>
              {dropdown.value.length > 0 ? dropdown.value : dropdown.placeholder}
            </div>
            <div className={styles.optionsContainer} style={{ display: 'none' }}>
              {qacWithOutFilter?.map((item: IConditionQuestionType) => (
                <div
                  key={item.extMap.UNIC_NAME}
                  className={styles.option}
                  //   onClick={() => handleOptionClick(item, dropdown.id!)}
                  onClick={(e) => updateDropdownValue(dropdown.id, item.caption, item.extMap.UNIC_NAME!)}>
                  {item.caption}
                </div>
              ))}
            </div>
          </div>
        </div>,
        container,
      );
    });
  }, [dropdowns, updateDropdownValue, removeDropdown]);

  const generateFormData = useCallback(() => {
    if (!editorRef.current) return { content: '', contentWithIds: '', dropdowns: [] };

    let finalText = '';
    let finalTextWithIds = '';
    const dropdownData: Array<{ id: string; value: string; unique_name: string; position: number }> = [];

    const walker = document.createTreeWalker(editorRef.current, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          let parent = node.parentNode;
          while (parent && parent !== editorRef.current) {
            if ((parent as Element).classList?.contains('dropdown-container')) {
              return NodeFilter.FILTER_REJECT;
            }
            parent = parent.parentNode;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
        if (node.nodeType === Node.ELEMENT_NODE && (node as Element).classList.contains('dropdown-container')) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      },
    });

    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent) {
        finalText += node.textContent;
        finalTextWithIds += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const dropdownId = element.getAttribute('data-dropdown-id');
        if (dropdownId) {
          const dropdown = dropdowns.find((d) => d.id === dropdownId);
          const selectedValue = dropdown?.value || `[${dropdown?.placeholder || 'Unselected'}]`;

          dropdownData.push({
            id: dropdownId,
            value: dropdown?.value || '',
            unique_name: dropdown?.unique_name || '',
            position: finalText.length,
          });

          finalText += ' ' + selectedValue;
          finalTextWithIds += ' ' + `${dropdown?.unique_name}`;
        }
      }
    }

    const result = {
      content: finalText,
      contentWithIds: finalTextWithIds,
      dropdowns: dropdownData,
    };

    return result;
  }, [dropdowns]);

  useEffect(() => {
    if (onDataChange && dropdowns.length > 0) {
      const formData = generateFormData();
      onDataChange(formData);
    }
  }, [dropdowns, generateFormData]);

  return (
    <div className='w-full max-w-[988px]'>
      {/* <form onSubmit={handleSubmit} className="space-y-6"> */}
      <span className='text-[#393939] text-sm max-w-[68px] mr-20 pr-2'>{label}</span>
      <div className='flex flex-row'>
        <div className='flex flex-col justify-start items-center -mr-3'>
          <button type='button' onClick={addDropdown} className='w-20 h-8 text-[#1758BA] bg-[#E8EEF8] rounded-md font-medium text-xs m-2 mt-1'>
            افزودن متغییر
          </button>
        </div>

        <div
          dir='rtl'
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          className={`min-h-[110px] focus:outline-none w-full leading-relaxed text-gray-900 relative rounded-lg px-4 py-2 border-[1px]  ${hasError ? 'border-rose-400' : 'border-[#DDE1E6]'}`}
          style={{
            lineHeight: '2.5',
            fontSize: '14px',
          }}
        />
        {renderDropdowns()}
      </div>
    </div>
  );
}
