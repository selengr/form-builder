'use client';
import { toast } from 'sonner';
import Image from 'next/image';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Box, Container, IconButton, Stack, TextField, Typography, useMediaQuery } from '@mui/material';

import { htmlToFormula } from '@/lib/htmlToFormula';
import { AxiosApi } from '@/services/axios/AxiosApi';
import { Element, FnFxItem } from '@/types/formulaEditor';
import { IAdvancedFormulaEditorProps } from '@/types/calculator';
// components
import BottomSheet from '@/components/BottomSheet/BottomSheet';
import FormulaInput from '@/components/formula-editor/FormulaInput';
import FormulaKeypad from '@/components/formula-editor/FormulaKeypad';
import FormulaControls from '@/components/formula-editor/FormulaControls';

const OPERATOR_TYPES = ['-', '+', '*', '/'];
const FN_FX_OPTIONS = [{ fnValue: 'avg', fnCaption: 'میانگین()' }];

const AdvancedFormulaEditor: React.FC<IAdvancedFormulaEditorProps> = ({ questionList, handleClose, editList, isEdit }) => {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery('(min-width:768px)');

  const mainIndex = useRef<number>(-2);
  const contentEditable = useRef<HTMLDivElement>(null);
  const selectAvgRef = useRef<Record<string, string>>({});
  const selectFieldRef = useRef<Record<string, string>>({});

  const editData = editList?.frontCalcData ? JSON.parse(editList.frontCalcData as string) : [];
  const [formName, setFormName] = useState<string>(editList?.name ?? '');
  const [cursorIndex, setCursorIndex] = useState<number>(0);
  const [elements, setElements] = useState<Element[]>(editData);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isMobileKeypadOpen, setIsMobileKeypadOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isEdit) {
      initializeFieldRefs();
    }
  }, [isEdit]);


  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        if(isEdit){
          router.push(`/builder/${id}/calculator/create?calcId=${isEdit}`);
        }else {
          router.push(`/builder/${id}/calculator/create`);
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const initializeFieldRefs = () => {
    if (!elements) return;

    elements.forEach((elem) => {
      if (elem.type === 'NEW_FIELD') {
        questionList.dataList.forEach((item: any) => {
          const { UNIC_NAME, STICKY_FUNC } = item.extMap;
          if (UNIC_NAME === elem.id || STICKY_FUNC === elem.id) {
            selectFieldRef.current[elem.id as string] = STICKY_FUNC || UNIC_NAME;
          }
        });
      }
    });
  };

  const isLastElementOperand = (): boolean => {
    if (elements.length === 0) return false;
    const lastElement = elements[elements.length - 1];
    return lastElement.type === 'NEW_FIELD' || lastElement.type === 'NUMBER' || lastElement.type === 'NEW_FnFx';
  };

  const updateCursorPosition = useCallback((newCursorIndex: number) => {
    setTimeout(() => {
      const editableDiv = contentEditable.current;
      if (!editableDiv) return;

      const range = document.createRange();
      const sel = window.getSelection();

      if (newCursorIndex >= editableDiv.childNodes.length) {
        if (editableDiv.lastChild) {
          range.setStartAfter(editableDiv.lastChild);
        } else {
          range.setStart(editableDiv, 0);
        }
      } else {
        const targetNode = editableDiv.childNodes[newCursorIndex];
        range.setStartBefore(targetNode);
      }

      range.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(range);
      editableDiv.focus();
      editableDiv.style.caretColor = '#1758BA';
    }, 10);
  }, []);

  const updateElements = useCallback(
    (newElements: Element[], newCursorIndex: number) => {
      setElements(newElements);
      setCursorIndex(newCursorIndex);
      updateCursorPosition(newCursorIndex);
    },
    [updateCursorPosition],
  );

  const isValidParenthesisPosition = (content: string): boolean => {
    if (content === '(') {
      if (cursorIndex === 0) return true;
      const prevElement = elements[cursorIndex - 1];
      return prevElement.type === 'OPERATOR' || (prevElement.type === 'PARENTHESIS' && prevElement.content === '(') || (prevElement.type === 'AVG_PARENTHESIS' && prevElement.content === '(');
    } else {
      if (cursorIndex === 0) return false;
      const prevElement = elements[cursorIndex - 1];
      return (
        prevElement.type === 'NEW_FIELD' ||
        prevElement.type === 'NUMBER' ||
        prevElement.type === 'NEW_FnFx' ||
        (prevElement.type === 'PARENTHESIS' && prevElement.content === ')') ||
        (prevElement.type === 'AVG_PARENTHESIS' && prevElement.content === ')')
      );
    }
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
    const insideAvg = isInsideAvg(index);

    if (insideAvg) return true;

    const prevElement = index > 0 ? elements[index - 1] : null;
    const nextElement = index < elements.length ? elements[index] : null;

    if (!forInsertion) {
      return !(prevElement?.type === 'OPERATOR' && nextElement?.type === 'OPERATOR');
    }

    if (prevElement?.type === 'OPERATOR' && nextElement?.type === 'OPERATOR') {
      return false;
    }

    return !(prevElement?.type === 'PARENTHESIS' && prevElement?.content === '(' && nextElement?.type === 'OPERATOR');
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
            if (parenthesisCount === 0) {
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
      // Prevent removing avg parentheses individually
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

      if ((prevElement.type === 'PARENTHESIS' || prevElement.type === 'AVG_PARENTHESIS') && prevElement.content === '(' && !insideAvg) {
        toast.error('عملگر نمی‌تواند بلافاصله بعد از پرانتز باز قرار گیرد');
        return;
      }
    }

    if (nextElement) {
      if (nextElement.type === 'OPERATOR' && !insideAvg) {
        toast.error('دو عملگر نمی‌توانند پشت سر هم قرار گیرند');
        return;
      }
    }

    if (cursorIndex > 0 && newElements[cursorIndex - 1].type === 'OPERATOR' && OPERATOR_TYPES.includes(newElements[cursorIndex - 1].content)) {
      newElements[cursorIndex - 1].content = content;
    } else {
      newElements.splice(cursorIndex, 0, { type: 'OPERATOR', content });
      newCursorIndex++;
    }

    updateElements(newElements, newCursorIndex);
  };

  const canAddNumber = (content: string): boolean => {
    const insideAvg = isInsideAvg(cursorIndex);

    if (insideAvg) return true;

    if (cursorIndex > 0 && elements[cursorIndex - 1].type === 'NUMBER') {
      return true;
    }

    const prevElement = cursorIndex > 0 ? elements[cursorIndex - 1] : null;
    const nextElement = cursorIndex < elements.length ? elements[cursorIndex] : null;

    if (prevElement) {
      if (prevElement.type === 'NUMBER') {
        return false;
      }

      if (!(prevElement.type === 'OPERATOR' || (prevElement.type === 'PARENTHESIS' && prevElement.content === '(') || (prevElement.type === 'AVG_PARENTHESIS' && prevElement.content === '('))) {
        return false;
      }
    }

    if (nextElement) {
      if (nextElement.type === 'NUMBER') {
        return false;
      }
    }

    return true;
  };

  const handleNumber = (content: string) => {
    if (!canAddNumber(content)) {
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
        newElements[cursorIndex - 1].content += content;
      } else if (currentNumber === '0' && content !== '.') {
        newElements[cursorIndex - 1].content = content;
      } else if (currentNumber === '.') {
        newElements[cursorIndex - 1].content = `0.${content}`;
      } else {
        newElements[cursorIndex - 1].content += content;
      }
    } else {
      if (content === '.') {
        newElements.splice(cursorIndex, 0, { type: 'NUMBER', content: '0.' });
      } else {
        newElements.splice(cursorIndex, 0, { type: 'NUMBER', content });
      }
      newCursorIndex++;
    }

    updateElements(newElements, newCursorIndex);
  };

  const handleParenthesis = (content: string) => {
    if (!isValidParenthesisPosition(content)) {
      toast.error(`امکان اضافه کردن پرانتز "${content}" در این موقعیت وجود ندارد`);
      return;
    }

    const newElements = [...elements];
    let newCursorIndex = cursorIndex;

    if (content === '(') {
      newElements.splice(cursorIndex, 0, { type: 'PARENTHESIS', content: '(' });
      newCursorIndex++;
    } else if (content === ')') {
      newElements.splice(cursorIndex, 0, { type: 'PARENTHESIS', content: ')' });
      newCursorIndex++;
    }

    updateElements(newElements, newCursorIndex);
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

  const handleDropdownClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    const isHidden = target.getAttribute('data-type') === 'down';
    toggleDropdown(target, isHidden);
  };

  const handleOptionClick = (item: any, dropdownId: string, element: any) => {
    const { UNIC_NAME, STICKY_FUNC } = item.extMap;
    const finalId = STICKY_FUNC ?? UNIC_NAME;

    const elementIndex = elements.findIndex((elem) => elem.id === dropdownId);
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
    updateCursorPosition(elementIndex + 1);
    closeDropdown(dropdownId);
  };

  const canAddField = (): boolean => {
    const insideAvg = isInsideAvg(cursorIndex);

    if (insideAvg) return true;

    if (elements.length === 0) return true;

    const prevElement = cursorIndex > 0 ? elements[cursorIndex - 1] : null;
    const nextElement = cursorIndex < elements.length ? elements[cursorIndex] : null;

    if (prevElement) {
      if (prevElement.type === 'NEW_FIELD' || prevElement.type === 'NUMBER' || prevElement.type === 'NEW_FnFx') {
        return false;
      }
    }

    if (nextElement) {
      if (nextElement.type === 'NEW_FIELD' || nextElement.type === 'NUMBER' || nextElement.type === 'NEW_FnFx') {
        return false;
      }
    }

    return true;
  };

  const handleNewField = () => {
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
    newElements.splice(cursorIndex, 0, newElement);
    updateElements(newElements, cursorIndex + 1);
  };

  const handleFnFXDropdownClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    const isHidden = target.getAttribute('data-type') === 'down';
    toggleDropdown(target, isHidden);
  };

  const handleFnFXOptionClick = (item: FnFxItem, id: string) => {
    const newElements = elements.map((elem) => (elem.id === id ? { ...elem, content: item.fnCaption } : elem));
    setElements(newElements);
    selectAvgRef.current[id] = item.fnValue;
    closeDropdown(id);
  };

  const handleFnFX = () => {
    if (isLastElementOperand()) {
      toast.error('لطفاً ابتدا یک عملگر وارد کنید');
      return;
    }

    const selectId = `select_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const fieldId = `select_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newElements = [...elements];

    // ساختار اولیه میانگین: میانگین(فیلد)
    newElements.splice(
      cursorIndex,
      0,
      {
        type: 'NEW_FnFx',
        content: 'میانگین()',
        id: selectId,
      },
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

    mainIndex.current += 4;
    setElements(newElements);
    selectAvgRef.current[selectId] = '#avgNumber';
    updateElements(newElements, cursorIndex + 3);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
    }
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      handleUndo();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const editableDiv = contentEditable.current;
    if (editableDiv) {
      const range = document.caretRangeFromPoint(e.clientX, e.clientY);
      if (range) {
        const index = Array.from(editableDiv.childNodes).findIndex((node, index) => index === range.endOffset);
        setCursorIndex(index === -1 ? elements.length : index);
      }
    }
  };

  const handleClosePage = () => {
    if (pathname.includes("/create")) {
      router.push(`/builder/${id}/calculator`);
    } else {
      handleClose()
    }
  }

  const callApi = async () => {
    if (!formName) {
      toast.error('ابتدا نام محاسبه گر را وارد کنید');
      return;
    }

    const newFormula = htmlToFormula(elements, selectFieldRef, selectAvgRef);
    if (!newFormula) {
      toast.error('هیچ محاسبه‌ای افزوده نشده');
      return;
    }
    if (newFormula.includes('undefined')) {
      toast.error('سوال انتخاب نشده دارید');
      return;
    }

    let formula = '';
    const avgNum = newFormula.split('#avg');
    avgNum.forEach((item) => {
      formula += item.includes('Number') ? `#avg${item.replaceAll('}{', '},{')}` : item;
    });

    try {
      setLoading(true);
      if (!isEdit) {
        await AxiosApi.post('/calculation', {
          name: formName,
          formBuilderId: id,
          theFormula: formula,
          frontCalcData: JSON.stringify(elements),
        });
      } else {
        await AxiosApi.put(`/calculation/${editList?.id}`, {
          id: editList?.id,
          name: formName,
          formBuilderId: id,
          theFormula: formula,
          frontCalcData: JSON.stringify(elements),
        });
      }
      queryClient.invalidateQueries({ queryKey: ['calculators'] });
      queryClient.invalidateQueries({ queryKey: ['Calculation_List'] });
      handleClosePage()
      toast.success('محاسبه گر با موفقیت ثبت شد');
    } catch (error) {
      toast.error('عملیات ناموفق بود مجددا امتحان نمایید');
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <Container maxWidth='sm' sx={{ padding: '0px', marginTop: { xs: "10px", md: "'-15px'", position: "relative" } }}>
      <Typography
        variant='subtitle1'
        sx={{
          display: { xs: "none", md: 'flex' },
          justifyContent: 'center',
          color: '#404040',
          fontWeight: 700,

        }}>
        محاسبه‌گر
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          direction: 'ltr',
          width: '100%',
          paddingX: { xs: 3, md: 0 }
        }}>
        <Stack spacing={1}>
          <Typography variant='subtitle2' color='#161616'>
            نام:
          </Typography>
          <TextField
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#DDE1E6',
                  borderRadius: '8px',
                },
                '&:hover fieldset': {
                  borderColor: '#DDE1E6',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#DDE1E6',
                },
              },
              '& input': {
                paddingX: 1,
                paddingY: 0,
                height: '50px',
              },
            }}
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
        </Stack>

        <Box
          sx={{
            width: '100%',
            display: "flex",
            flexDirection: { xs: 'row', sm: 'row' },
            my: 3,
          }}>
          {
            isDesktop && (
              <FormulaKeypad
                handleFnFX={handleFnFX}
                handleNewField={handleNewField}
                handleParenthesis={handleParenthesis}
                handleOperator={handleOperator}
                handleNumber={handleNumber}
                handleUndo={handleUndo}
                contentEditableRef={contentEditable}
              />
            )
          }


          <Box
            sx={{
              width: { xs: '100%', sm: '73%' },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              mt: { xs: 2, sm: 0 },
              ml: { xs: 0, sm: 2 },
            }}>
            <Typography
              variant='subtitle1'
              sx={{
                display: 'flex',
                justifyContent: 'center',
                color: '#404040',
                fontWeight: 500,
              }}>
              اسکریپت:
            </Typography>
            <Stack
              sx={{
                border: '1px solid #DDE1E6',
                borderRadius: 2,
                padding: 1,
                width: '100%',
                height: '100%',
                minHeight: { xs: 250, md: 200 },
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row',
              }}>
              <FormulaInput
                elements={elements}
                questionList={questionList}
                contentEditableRef={contentEditable}
                onFieldSelect={handleOptionClick}
                onFieldClick={handleDropdownClick}
                onFnSelect={handleFnFXOptionClick}
                onFnClick={handleFnFXDropdownClick}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
              />
            </Stack>
          </Box>
        </Box>


        <Stack
          sx={{
            width: "100%",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'end'

          }}>
          <IconButton
            sx={{
              display: { sx: "flex", md: "none" },
              // transform: open ? 'rotate(180deg)' : undefined,  
              width: 72,
              hight: 72,
            }}
            onClick={() => setIsMobileKeypadOpen(true)}
          >
            <Image src='/images/calc/ic_keypad.svg' width={52} height={52} alt='keypad' />
          </IconButton>

        </Stack>
        <FormulaControls onSubmit={callApi} onCancel={handleClosePage} isLoading={isLoading} />
      </Box>

      <BottomSheet open={isMobileKeypadOpen} onClose={() => setIsMobileKeypadOpen(false)} title="ماشین حساب">

        <FormulaKeypad
          handleFnFX={handleFnFX}
          handleNewField={handleNewField}
          handleParenthesis={handleParenthesis}
          handleOperator={handleOperator}
          handleNumber={handleNumber}
          handleUndo={handleUndo}
          contentEditableRef={contentEditable}
        />
      </BottomSheet>
    </Container>
  );
};

export default AdvancedFormulaEditor;