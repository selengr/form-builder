'use client';

import { toast } from 'sonner';
import { useMediaQuery } from '@mui/material';
import React, { Ref, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Element, FnFxItem, CalculatorResult, IFieldQuestionData } from './types';
import styles from './formulaCalculator.module.css';
import KeypadPanel from './KeypadPanel';
import FormulaEditor, { FormulaKeyAction } from './editor/FormulaEditor';
import { htmlToFormula } from './utils/htmlToFormula';
import { buildCalculatorFormula } from './utils/buildCalculatorFormula';
import { getCalculatorFieldId } from './utils/getCalculatorFieldId';
import { restoreCalculatorRefs } from './utils/restoreCalculator';

const OPERATOR_TYPES = ['-', '+', '*', '/', '^'];
const NEGATIVE_SIGN = '-';
const SCRIPT_BOX_MIN_HEIGHT = 161;
const SCRIPT_BOX_MOBILE_HEIGHT = 211;

export interface FormulaCalculatorHandle {
  getResult: () => CalculatorResult | null;
}

export interface FormulaCalculatorProps {
  fields: IFieldQuestionData;
  ref?: Ref<FormulaCalculatorHandle>;
  initialElements?: Element[];
  beforeAddField?: () => boolean;
  onFormulaChange?: (formula: string, frontCalcData: string) => void;
  onElementsCountChange?: (count: number) => void;
  showFormulaPreview?: boolean;
  scriptLayout?: 'fixed' | 'stretch';
}

export default function FormulaCalculator({
  fields,
  ref,
  initialElements,
  beforeAddField,
  onFormulaChange,
  onElementsCountChange,
  showFormulaPreview = false,
  scriptLayout = 'fixed',
}: FormulaCalculatorProps) {
  const isDesktop = useMediaQuery('(min-width:900px)');
  const questionList = fields;

  const [restored] = useState(() => {
    const restoredElements = initialElements ?? [];
    return { elements: restoredElements, ...restoreCalculatorRefs(restoredElements) };
  });

  const mainIndex = useRef<number>(restored.lastMainIndex);
  const selectAvgRef = useRef<Record<string, string>>(restored.avgRefs);
  const selectFieldRef = useRef<Record<string, string>>(restored.fieldRefs);

  const [cursorIndex, setCursorIndex] = useState<number>(restored.elements.length);
  const [elements, setElements] = useState<Element[]>(restored.elements);
  const [focusRequest, setFocusRequest] = useState(0);
  const keyActionQueueRef = useRef<FormulaKeyAction[]>([]);
  const [keyActionTick, setKeyActionTick] = useState(0);
  const [liveFormula, setLiveFormula] = useState('');
  const formulaPreviewRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const requestFocus = useCallback(() => setFocusRequest((value) => value + 1), []);

  const isLastElementOperand = (): boolean => {
    if (elements.length === 0) return false;
    const lastElement = elements[elements.length - 1];
    return (
      lastElement.type === 'NEW_FIELD' ||
      lastElement.type === 'PARENTHESIS' ||
      lastElement.type === 'NUMBER' ||
      lastElement.type === 'NEW_FnFx'
    );
  };

  const updateElements = useCallback(
    (incomingElements: Element[], newCursorIndex: number, normalize: boolean = true) => {
      const cloned = incomingElements.map((e) => ({ ...e })) as Element[];
      if (normalize) {
        mainIndex.current = -2;

        for (let i = 0; i < cloned.length; i++) {
          const elem = cloned[i];
          if (elem.type === 'NEW_FIELD' || elem.type === 'NEW_FnFx') {
            mainIndex.current += 2;
            elem.mainIndex = mainIndex.current;
          } else {
            delete elem.mainIndex;
          }
        }
      }
      setElements(cloned);
      setCursorIndex(newCursorIndex);
      requestFocus();
    },
    [requestFocus],
  );

  const isValidParenthesisPosition = (content: string): boolean => {
    if (content === '(') {
      if (cursorIndex === 0) return true;
      const prevElement = elements[cursorIndex - 1];
      return (
        prevElement.type === 'OPERATOR' ||
        (prevElement.type === 'PARENTHESIS' && prevElement.content === '(') ||
        (prevElement.type === 'AVG_PARENTHESIS' && prevElement.content === '(')
      );
    }

    const prevElement = elements[cursorIndex - 1];
    if (content === ')' && prevElement?.type === 'NEW_FnFx') {
      return false;
    }
    if (cursorIndex === 0) return false;
    return (
      prevElement.type === 'NEW_FIELD' ||
      prevElement.type === 'NUMBER' ||
      prevElement.type === 'NEW_FnFx' ||
      (prevElement.type === 'PARENTHESIS' && prevElement.content === ')') ||
      (prevElement.type === 'AVG_PARENTHESIS' && prevElement.content === ')')
    );
  };

  const isInsideAvg = (index: number): boolean => {
    let openCount = 0;
    for (let i = 0; i < index; i++) {
      if (elements[i].type === 'AVG_PARENTHESIS') {
        if (elements[i].content === '(') {
          openCount++;
        } else if (elements[i].content === ')') {
          openCount--;
        }
      }
    }
    return openCount > 0;
  };

  const isValidCursorPosition = (index: number, forInsertion: boolean = false): boolean => {
    if (isInsideAvg(index)) return true;

    const prevElement = index > 0 ? elements[index - 1] : null;
    const nextElement = index < elements.length ? elements[index] : null;

    if (!forInsertion) {
      return !(prevElement?.type === 'OPERATOR' && nextElement?.type === 'OPERATOR');
    }

    if (prevElement?.type === 'NEW_FnFx' && nextElement?.type === 'AVG_PARENTHESIS') {
      return false;
    }
    if (prevElement?.type === 'OPERATOR' && nextElement?.type === 'OPERATOR') {
      return false;
    }

    return !(
      prevElement?.type === 'PARENTHESIS' &&
      prevElement?.content === '(' &&
      nextElement?.type === 'OPERATOR'
    );
  };

  const handleUndo = useCallback(() => {
    if (elements.length === 0 || cursorIndex === 0) return;

    const newElements = [...elements];
    let elementsToRemove = 1;

    if (elements[cursorIndex - 1].type === 'NEW_FnFx') {
      let endIndex = cursorIndex - 1;
      let parenthesisCount = 0;

      for (let i = cursorIndex; i < elements.length; i++) {
        if (elements[i].type === 'AVG_PARENTHESIS') {
          if (elements[i].content === '(') {
            parenthesisCount++;
          } else if (elements[i].content === ')') {
            if (parenthesisCount === 1) {
              endIndex = i;
              break;
            }
            parenthesisCount--;
          }
        }
      }
      elementsToRemove = endIndex - cursorIndex + 2;
      mainIndex.current += -elementsToRemove;
    } else if (elements[cursorIndex - 1].type === 'AVG_PARENTHESIS') {
      toast.info('این پرانتز مربوط به تابع میانگین است.', {
        description: 'لطفاً برای حذف تابع میانگین، مکان‌نما را بلافاصله بعد از تابع قرار دهید.',
      });
      return;
    }

    newElements.splice(cursorIndex - 1, elementsToRemove);
    updateElements(newElements, Math.max(0, cursorIndex - 1));
  }, [elements, cursorIndex, updateElements]);

  const handleOperator = (content: string) => {
    const newElements = [...elements];
    let newCursorIndex = cursorIndex;
    const insideAvg = isInsideAvg(cursorIndex);

    if (!insideAvg && !isValidCursorPosition(cursorIndex, true)) {
      toast.error('امکان اضافه کردن عملگر در این موقعیت وجود ندارد');
      return;
    }

    if (cursorIndex === 0 && !insideAvg) {
      toast.error('فرمول نمی‌تواند با عملگر شروع شود');
      return;
    }

    const prevElement = cursorIndex > 0 ? elements[cursorIndex - 1] : null;
    const nextElement = cursorIndex < elements.length ? elements[cursorIndex] : null;

    if (prevElement) {
      if (prevElement.type === 'OPERATOR' && !insideAvg) {
        toast.error('عملگر نمی‌تواند بعد از عملگر دیگر قرار گیرد');
        return;
      }

      if (
        (prevElement.type === 'PARENTHESIS' || prevElement.type === 'AVG_PARENTHESIS') &&
        prevElement.content === '(' &&
        !insideAvg
      ) {
        toast.error('عملگر نمی‌تواند بلافاصله بعد از پرانتز باز قرار گیرد');
        return;
      }
    }

    if (nextElement?.type === 'OPERATOR' && !insideAvg) {
      toast.error('دو عملگر نمی‌توانند پشت سر هم قرار گیرند');
      return;
    }

    if (
      cursorIndex > 0 &&
      newElements[cursorIndex - 1].type === 'OPERATOR' &&
      OPERATOR_TYPES.includes(newElements[cursorIndex - 1].content)
    ) {
      newElements[cursorIndex - 1].content = content;
    } else {
      newElements.splice(cursorIndex, 0, { type: 'OPERATOR', content });
      newCursorIndex++;
    }

    updateElements(newElements, newCursorIndex);
  };

  const canAddNumber = (): boolean => {
    if (isInsideAvg(cursorIndex)) return true;

    if (cursorIndex > 0 && elements[cursorIndex - 1].type === 'NUMBER') {
      return true;
    }

    const prevElement = cursorIndex > 0 ? elements[cursorIndex - 1] : null;
    const nextElement = cursorIndex < elements.length ? elements[cursorIndex] : null;

    if (
      prevElement &&
      !(
        prevElement.type === 'OPERATOR' ||
        (prevElement.type === 'PARENTHESIS' && prevElement.content === '(') ||
        (prevElement.type === 'AVG_PARENTHESIS' && prevElement.content === '(')
      )
    ) {
      return false;
    }

    return nextElement?.type !== 'NUMBER';
  };

  const handleNumber = (content: string) => {
    if (!canAddNumber()) {
      toast.error('امکان اضافه کردن عدد در این موقعیت وجود ندارد');
      return;
    }

    const newElements = [...elements];
    let newCursorIndex = cursorIndex;

    if (cursorIndex > 0 && newElements[cursorIndex - 1].type === 'NUMBER') {
      const currentNumber = newElements[cursorIndex - 1].content;

      if (content === '.') {
        if (currentNumber.includes('.')) {
          toast.error('عدد نمی‌تواند بیش از یک ممیز اعشار داشته باشد');
          return;
        }
        newElements[cursorIndex - 1].content += currentNumber === NEGATIVE_SIGN ? `0${content}` : content;
      } else if (currentNumber === '0' || currentNumber === `${NEGATIVE_SIGN}0`) {
        newElements[cursorIndex - 1].content = currentNumber.replace(/0$/, content);
      } else if (currentNumber === '.') {
        newElements[cursorIndex - 1].content = `0.${content}`;
      } else {
        newElements[cursorIndex - 1].content += content;
      }
    } else {
      newElements.splice(cursorIndex, 0, {
        type: 'NUMBER',
        content: content === '.' ? '0.' : content,
      });
      newCursorIndex++;
    }

    updateElements(newElements, newCursorIndex);
  };

  const handleToggleSign = () => {
    const prevElement = cursorIndex > 0 ? elements[cursorIndex - 1] : null;

    if (prevElement?.type === 'NUMBER') {
      const newElements = [...elements];
      const toggled = prevElement.content.startsWith(NEGATIVE_SIGN)
        ? prevElement.content.slice(1)
        : `${NEGATIVE_SIGN}${prevElement.content}`;

      if (!toggled) {
        newElements.splice(cursorIndex - 1, 1);
        updateElements(newElements, cursorIndex - 1);
        return;
      }

      newElements[cursorIndex - 1] = { ...prevElement, content: toggled };
      updateElements(newElements, cursorIndex);
      return;
    }

    if (!canAddNumber()) {
      toast.error('امکان اضافه کردن عدد در این موقعیت وجود ندارد');
      return;
    }

    const newElements = [...elements];
    newElements.splice(cursorIndex, 0, { type: 'NUMBER', content: NEGATIVE_SIGN });
    updateElements(newElements, cursorIndex + 1);
  };

  const handleParenthesis = (content: string) => {
    if (!isValidParenthesisPosition(content)) {
      toast.error(`امکان اضافه کردن پرانتز "${content}" در این موقعیت وجود ندارد`);
      return;
    }

    const newElements = [...elements];
    newElements.splice(cursorIndex, 0, { type: 'PARENTHESIS', content });
    updateElements(newElements, cursorIndex + 1);
  };

  const toggleDropdown = (element: HTMLElement, isHidden: boolean) => {
    const optionsContainer = element.nextElementSibling as HTMLElement;
    element.setAttribute('data-type', isHidden ? 'up' : 'down');
    if (optionsContainer) {
      optionsContainer.style.display = isHidden ? 'block' : 'none';
    }
  };

  const closeDropdown = (id: string) => {
    const dropdownContainer = document.querySelector(`[data-id="${id}"]`);
    if (!dropdownContainer) return;

    const optionsContainer = dropdownContainer.querySelector('.optionsContainer') as HTMLElement;
    const dropdownButton = dropdownContainer.querySelector('.customDropdown') as HTMLElement;

    if (optionsContainer) optionsContainer.style.display = 'none';
    if (dropdownButton) dropdownButton.setAttribute('data-type', 'down');
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    toggleDropdown(target, target.getAttribute('data-type') === 'down');
  };

  const handleOptionClick = (item: any, dropdownId: string, element: any) => {
    const finalId = getCalculatorFieldId(item);
    if (!finalId) return;

    const elementIndex = elements.findIndex(
      (elem) => elem.id === dropdownId && element.mainIndex === elem.mainIndex,
    );
    if (elementIndex === -1) return;
    const newElements = [...elements];

    newElements[elementIndex] = {
      type: 'NEW_FIELD',
      content: item.caption,
      id: finalId,
      mainIndex: element.mainIndex,
      isInAvg: element.isInAvg,
    };

    setElements(newElements);
    selectFieldRef.current[finalId] = finalId;

    setCursorIndex(elementIndex + 1);
    requestFocus();
    closeDropdown(dropdownId);
  };

  const canAddField = (): boolean => {
    if (isInsideAvg(cursorIndex)) return true;
    if (elements.length === 0) return true;

    const prevElement = cursorIndex > 0 ? elements[cursorIndex - 1] : null;
    const nextElement = cursorIndex < elements.length ? elements[cursorIndex] : null;

    if (
      prevElement &&
      (prevElement.type === 'NEW_FIELD' ||
        prevElement.type === 'PARENTHESIS' ||
        prevElement.type === 'NUMBER' ||
        prevElement.type === 'NEW_FnFx')
    ) {
      return false;
    }

    return !(
      nextElement &&
      (nextElement.type === 'NEW_FIELD' ||
        nextElement.type === 'NUMBER' ||
        nextElement.type === 'NEW_FnFx')
    );
  };

  const handleNewField = () => {
    if (beforeAddField && !beforeAddField()) return;

    if (!isValidCursorPosition(cursorIndex, true)) {
      toast.error('امکان اضافه کردن فیلد در این موقعیت وجود ندارد');
      return;
    }

    if (!canAddField()) {
      toast.error('فیلد جدید فقط می‌تواند بعد از پرانتز باز یا عملگر اضافه شود');
      return;
    }

    const insideAvg = isInsideAvg(cursorIndex);
    mainIndex.current += 2;
    const selectId = `select_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newElement: Element = {
      type: 'NEW_FIELD',
      content: 'انتخاب سوال',
      id: selectId,
      mainIndex: mainIndex.current,
      isInAvg: insideAvg,
    };

    const newElements = [...elements];
    for (let i = cursorIndex; i < newElements.length; i++) {
      const current = newElements[i].mainIndex;
      if (typeof current === 'number') {
        newElements[i].mainIndex = current - 2;
      }
    }
    newElements.splice(cursorIndex, 0, newElement);
    updateElements(newElements, cursorIndex + 1);
  };

  const handleFnFXDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleFnFXOptionClick = (item: FnFxItem, id: string) => {
    setElements(elements.map((elem) => (elem.id === id ? { ...elem, content: item.fnCaption } : elem)));
    selectAvgRef.current[id] = item.fnValue;
    closeDropdown(id);
  };

  const handleFnFX = () => {
    if (beforeAddField && !beforeAddField()) return;

    if (isLastElementOperand()) {
      toast.error('لطفاً ابتدا یک عملگر وارد کنید');
      return;
    }

    const selectId = `select_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const fieldId = `select_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newElements = [...elements];

    newElements.splice(
      cursorIndex,
      0,
      { type: 'NEW_FnFx', content: 'میانگین', id: selectId },
      { type: 'AVG_PARENTHESIS', content: '(' },
      {
        type: 'NEW_FIELD',
        content: 'انتخاب سوال',
        id: fieldId,
        mainIndex: mainIndex.current + 2,
        isInAvg: true,
      },
      { type: 'AVG_PARENTHESIS', content: ')' },
    );

    selectAvgRef.current[selectId] = '#avgNumber';
    updateElements(newElements, cursorIndex + 3);
  };

  const handleKeyAction = (action: FormulaKeyAction) => {
    if (action.kind === 'number') handleNumber(action.value);
    else if (action.kind === 'operator') handleOperator(action.value);
    else if (action.kind === 'parenthesis') handleParenthesis(action.value);
    else handleUndo();
  };

  const enqueueKeyActions = useCallback((actions: FormulaKeyAction[]) => {
    keyActionQueueRef.current.push(...actions);
    setKeyActionTick((tick) => tick + 1);
  }, []);

  useEffect(() => {
    const nextAction = keyActionQueueRef.current.shift();
    if (!nextAction) return;
    handleKeyAction(nextAction);
    if (keyActionQueueRef.current.length) setKeyActionTick((tick) => tick + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyActionTick]);

  useEffect(() => {
    onElementsCountChange?.(elements.length);
  }, [elements.length, onElementsCountChange]);

  useEffect(() => {
    const rawFormula = htmlToFormula(elements, selectFieldRef, selectAvgRef).replaceAll('undefined', '?');
    let formula = rawFormula;
    try {
      formula = rawFormula ? buildCalculatorFormula(rawFormula) : '';
    } catch {
      formula = rawFormula;
    }
    setLiveFormula(formula);
    onFormulaChange?.(formula, JSON.stringify(elements));
  }, [elements, onFormulaChange]);

  useEffect(() => {
    const preview = formulaPreviewRef.current;
    if (preview) preview.scrollLeft = preview.scrollWidth;
  }, [liveFormula]);

  useImperativeHandle(
    ref,
    () => ({
      getResult: () => {
        const newFormula = htmlToFormula(elements, selectFieldRef, selectAvgRef);

        if (!newFormula) {
          return { formula: '', frontCalcData: JSON.stringify(elements) };
        }
        if (newFormula.includes('undefined')) {
          toast.error('سوال انتخاب نشده دارید');
          return null;
        }
        if (elements.some((element) => element.type === 'NUMBER' && !/\d/.test(element.content))) {
          toast.error('عدد وارد شده کامل نیست');
          return null;
        }

        return {
          formula: buildCalculatorFormula(newFormula),
          frontCalcData: JSON.stringify(elements),
        };
      },
    }),
    [elements],
  );

  if (!isClient) return null;

  const keypad = (
    <KeypadPanel
      handleFnFX={handleFnFX}
      handleNewField={handleNewField}
      handleParenthesis={handleParenthesis}
      handleOperator={handleOperator}
      handleNumber={handleNumber}
      handleToggleSign={handleToggleSign}
      handleUndo={handleUndo}
      variant={isDesktop ? 'desktop' : 'mobile'}
    />
  );

  const isStretch = scriptLayout === 'stretch' && isDesktop;
  const scriptBoxHeight = isDesktop ? SCRIPT_BOX_MIN_HEIGHT : SCRIPT_BOX_MOBILE_HEIGHT;

  return (
    <div dir="rtl" className="w-full flex flex-col">
      <div className={`w-full flex flex-row ${isStretch ? 'items-stretch' : 'items-start'}`}>
        <div className="flex-1 w-full min-w-0 flex flex-col">
          <label className="block text-[13px] md:text-sm font-medium text-[#161616]" style={{ marginBottom: 14 }}>
            اسکریپت:
          </label>
          <div
            data-formula-scroll
            className={`relative w-full ${isStretch ? 'flex-1' : ''} rounded-[20px] border border-[#DDE1E6] bg-[#F8FAFC] p-3 overflow-y-auto`}
            style={
              isStretch
                ? { minHeight: SCRIPT_BOX_MIN_HEIGHT }
                : { height: scriptBoxHeight, maxHeight: scriptBoxHeight }
            }>
            <FormulaEditor
              elements={elements}
              cursorIndex={cursorIndex}
              focusRequest={focusRequest}
              onCursorChange={setCursorIndex}
              onKeyActions={enqueueKeyActions}
              fields={questionList}
              onFieldSelect={handleOptionClick}
              onFieldClick={handleDropdownClick}
              onFnSelect={handleFnFXOptionClick}
              onFnClick={handleFnFXDropdownClick}
            />
          </div>

          {showFormulaPreview && (
            <div
              dir="ltr"
              title={liveFormula}
              className={`${styles.formulaPreview} relative shrink-0 rounded-[10px] border border-[#DDE1E6] bg-[#F4F5F7]`}
              style={{ marginTop: 8, height: 34, fontSize: 13 }}>
              <div
                ref={formulaPreviewRef}
                className="absolute flex items-center"
                style={{ inset: 0, padding: '0 12px', gap: 8, overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap', scrollbarWidth: 'thin' }}>
                <span style={{ color: '#9EA3AC', fontSize: 11, flexShrink: 0 }}>formula</span>
                {liveFormula ? (
                  <span style={{ color: '#1758BA', flexShrink: 0 }}>
                    {liveFormula.split(/(\?)/).map((part, index) =>
                      part === '?' ? (
                        <span key={index} style={{ color: '#D98213' }}>
                          ?
                        </span>
                      ) : (
                        part
                      ),
                    )}
                  </span>
                ) : (
                  <span style={{ color: '#C1C7CD' }}>—</span>
                )}
              </div>
            </div>
          )}
        </div>

        {isDesktop && keypad}
      </div>

      {!isDesktop && <div className="px-1 mt-4 flex justify-center items-center">{keypad}</div>}
    </div>
  );
}
