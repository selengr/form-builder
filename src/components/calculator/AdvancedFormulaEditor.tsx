"use client"

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styles from './advancedFormulaEditor.module.css'
import JSONData from '../../../public/fake-data/response_v1.json'
import { Element, FnFxItem } from '../../types/formulaEditor';
import { htmlToFormula } from '../../lib/formulaUtils';
import Keypad from "./Keypad";
import AxiosApi from "@/services/axios/AxiosApi";
import { toast } from "sonner";
import { useParams } from "next/navigation";


const AdvancedFormulaEditor: React.FC<any> = ({questionList}) => {
  const { id } = useParams();
  const [formName, setFormName] = useState<string>("");
  const [cursorIndex, setCursorIndex] = useState<number>(0);
  const [elements, setElements] = useState<Element[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const contentEditable = useRef<HTMLDivElement>(null);
  const selectAvgRef = useRef<{ [key: string]: string }>({});
  const selectFieldRef = useRef<{ [key: string]: string }>({});

  const handleUndo = useCallback(() => {
    if (elements.length === 0 || cursorIndex === 0) return;

    const newElements = [...elements];
    newElements.splice(cursorIndex - 1, 1);
    const newCursorIndex = Math.max(0, cursorIndex - 1);

    updateElements(newElements, newCursorIndex);
  }, [elements, cursorIndex]);

  const updateElements = (newElements: Element[], newCursorIndex: number) => {
    setElements(newElements);
    setCursorIndex(newCursorIndex);
    setTimeout(() => {
      const editableDiv = contentEditable.current;
      if (editableDiv) {
        const range = document.createRange();
        const sel = window.getSelection();

        if (newCursorIndex >= editableDiv.childNodes.length) {
          range.setStartAfter(editableDiv.lastChild || editableDiv);
        } else {
          range.setStartAfter(editableDiv.childNodes[newCursorIndex - 1] || editableDiv);
        }

        range.collapse(true);
        sel?.removeAllRanges();
        sel?.addRange(range);
        editableDiv.focus();
      }
    }, 0);
  };

  const handleOperator = (content: string) => {
    const newElements = [...elements];
    const operatorTypes = ['-', '+', '*', '/'];
    let newCursorIndex = cursorIndex;

    if (cursorIndex > 0 && newElements[cursorIndex - 1].type === 'OPERATOR' && operatorTypes.includes(newElements[cursorIndex - 1].content)) {
      newElements[cursorIndex - 1] = { type: 'OPERATOR', content };
    } else {
      newElements.splice(cursorIndex, 0, { type: 'OPERATOR', content });
      newCursorIndex++;
    }

    updateElements(newElements, newCursorIndex);
  };

  const handleNumber = (content: string) => {
    const newElements: Element[] = [...elements];
    let newCursorIndex = cursorIndex;

    if (cursorIndex > 0 && newElements[cursorIndex - 1].type === 'NUMBER') {
      newElements[cursorIndex - 1].content += content;
    } else {
      newElements.splice(cursorIndex, 0, { type: 'NUMBER', content });
      newCursorIndex++;
    }

    updateElements(newElements, newCursorIndex);
  };

  const handleParenthesis = (content: string) => {
    const newElements = [...elements];
    let newCursorIndex = cursorIndex;
    if (content === '(') {
      newElements.splice(cursorIndex, 0,
        { type: 'PARENTHESIS', content: '(' });
      newElements.splice(cursorIndex + 1, 0,
        { type: 'PARENTHESIS', content: ')' }
      );
      newCursorIndex++;
    } else if (content === ')') {
      newElements.splice(cursorIndex, 0,
        { type: 'PARENTHESIS', content: ')' }
      );
      newCursorIndex++;
    }
    updateElements(newElements, newCursorIndex);
  };

  const handleDropdownClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const optionsContainer = (e.target as HTMLElement).nextElementSibling as HTMLElement;
    const isHidden = optionsContainer.style.display === 'none';
    optionsContainer.style.display = isHidden ? 'block' : 'none';
    (e.target as HTMLElement).setAttribute('data-type', isHidden ? 'up' : 'down');
  };

  const handleOptionClick = (item: any, id: string) => {
    const newElements = elements.map(elem =>
      elem.id === id ? { ...elem, content: item.caption } : elem
    );
    setElements(newElements);
    selectFieldRef.current[id] = item.extMap.UNIC_NAME;

    const optionsContainer = document.querySelector(`[data-id="${id}"] .${styles.optionsContainer}`) as HTMLElement;
    if (optionsContainer) {
      optionsContainer.style.display = 'none';
    }

    const dropdownButton = document.querySelector(`[data-id="${id}"] .${styles.customDropdown}`) as HTMLElement;
    if (dropdownButton) {
      dropdownButton.setAttribute('data-type', 'down');
    }
  };

  const handleNewField = () => {
    const editableDiv = contentEditable.current;
    if (!editableDiv) return;

    const selectId = `select_${Date.now()}`;
    const newElement: Element = {
      type: 'NEW_FIELD',
      content: 'انتخاب سوال',
      id: selectId
    };

    const newElements = [...elements];
    newElements.splice(cursorIndex, 0, newElement);

    setElements(newElements);

    setTimeout(() => {
      const range = document.createRange();
      const sel = window.getSelection();

      if (editableDiv.childNodes[cursorIndex]) {
        range.setStartAfter(editableDiv.childNodes[cursorIndex]);
      } else {
        range.setStartAfter(editableDiv.lastChild || editableDiv);
      }

      range.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(range);

      setCursorIndex(cursorIndex + 1);
      editableDiv.focus();
    }, 0);
  };

  const renderElements = useCallback(() => {
    return elements.map((elem, index) => {
      if (elem.type === 'NEW_FIELD') {
        return (
          <div
            key={elem.id}
            data-id={elem.id}
            contentEditable={false}
            className={`${styles.dynamicbtn} ${styles.NEW_FIELD}`}
            data-type="NEW_FIELD"
          >
            <div
              className={styles.customDropdown}
              data-type="down"
              onClick={(e) => handleDropdownClick(e, elem.id!)}
            >
              {elem.content}
            </div>
            <div className={styles.optionsContainer} style={{ display: 'none' }}>
              {questionList.dataList.map((item: any) => (
                <div
                  key={item.extMap.UNIC_NAME}
                  className={styles.option}
                  onClick={() => handleOptionClick(item, elem.id!)}
                >
                  {item.caption}
                </div>
              ))}
            </div>
          </div>
        );
      } else if (elem.type === 'NEW_FnFx') {
        return (
          <div
            key={elem.id}
            data-id={elem.id}
            contentEditable={false}
            className={`${styles.dynamicbtn} ${styles.NEW_FnFx}`}
            data-type="NEW_FnFx"
          >
            <div
              className={styles.customDropdown}
              data-type="down"
              onClick={(e) => handleFnFXDropdownClick(e, elem.id!)}
            >
              {elem.content}
            </div>
            <div className={styles.optionsContainer} style={{ display: 'none' }}>
              {[{ fnValue: "avg", fnCaption: "میانگین()" }].map((item) => (
                <div
                  key={item.fnValue}
                  className={styles.option}
                  onClick={() => handleFnFXOptionClick(item, elem.id!)}
                >
                  {item.fnCaption}
                </div>
              ))}
            </div>
          </div>
        );
      } else {
        return (
          <div
            key={index}
            contentEditable={false}
            className={`${styles.dynamicbtn} ${styles[elem.type]}`}
            data-type={elem.type}
          >
            {elem.content}
          </div>
        );
      }
    });
  }, [elements, styles]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.NEW_FIELD}`) && !target.closest(`.${styles.NEW_FnFx}`)) {
        const allOptionContainers = document.querySelectorAll(`.${styles.optionsContainer}`);
        allOptionContainers.forEach((container: any) => {
          (container as HTMLElement).style.display = 'none';
        });
        const allDropdowns = document.querySelectorAll(`.${styles.customDropdown}`);
        allDropdowns.forEach((dropdown: any) => {
          dropdown.setAttribute('data-type', 'down');
        });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [styles]);

  const handleFnFXDropdownClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const optionsContainer = (e.target as HTMLElement).nextElementSibling as HTMLElement;
    const isHidden = optionsContainer.style.display === 'none';
    optionsContainer.style.display = isHidden ? 'block' : 'none';
    (e.target as HTMLElement).setAttribute('data-type', isHidden ? 'up' : 'down');
  };

  const handleFnFXOptionClick = (item: FnFxItem, id: string) => {
    const newElements = elements.map(elem =>
      elem.id === id ? { ...elem, content: item.fnCaption } : elem
    );
    setElements(newElements);
    selectAvgRef.current[id] = item.fnValue;

    const optionsContainer = document.querySelector(`[data-id="${id}"] .${styles.optionsContainer}`) as HTMLElement;
    if (optionsContainer) {
      optionsContainer.style.display = 'none';
    }

    const dropdownButton = document.querySelector(`[data-id="${id}"] .${styles.customDropdown}`) as HTMLElement;
    if (dropdownButton) {
      dropdownButton.setAttribute('data-type', 'down');
    }
  };

  const handleFnFX = () => {
    const editableDiv = contentEditable.current;
    if (!editableDiv) return;

    const selectId = `select_${Date.now()}`;
    const newElement: Element = {
      type: 'NEW_FnFx',
      content: 'میانگین()',
      id: selectId,
    };

    const newElements = [...elements];
    newElements.splice(cursorIndex, 0, newElement);
    newElements.splice(cursorIndex + 1, 0, { type: 'AVG_PARENTHESIS', content: '(' });
    newElements.splice(cursorIndex + 2, 0, { type: 'AVG_PARENTHESIS', content: ')' });

    setElements(newElements);
    selectAvgRef.current[selectId] = '#avgNumber';

    setTimeout(() => {
      const range = document.createRange();
      const sel = window.getSelection();

      if (editableDiv.childNodes[cursorIndex + 1]) {
        range.setStartAfter(editableDiv.childNodes[cursorIndex + 1]);
      } else {
        range.setStartAfter(editableDiv.lastChild || editableDiv);
      }

      range.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(range);

      setCursorIndex(cursorIndex + 2);
      editableDiv.focus();
    }, 0);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!/^[0-9+\-*/().()]$/.test(event.key) &&
      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
      event.preventDefault();
    }
    if (event.key === "Enter") {
      event.preventDefault();
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


  const callApi = async () => {
    let formula = ''
    const newFormula = htmlToFormula(elements, selectFieldRef, selectAvgRef);
    if(!!!formName) return toast.error("ابتدا نام محاسبه گر را وارد کنید");
    if(!!!newFormula) return toast.error("هیج محاسبه ای افزوده نشده");
    if(newFormula.includes("undefined")) return toast.error("سوال انتخاب نشده دارید");


        
        const avgNum = newFormula.split("#avg")
        avgNum.map(item => {
          if (item.includes("Number")) {
            formula += "#avg" + item?.replaceAll("}{", "},{")
          } else {
            formula += item
          }
        })
      

    try {
     
      const response = await AxiosApi.post(`/calculation`,{
        "name": formName,
        "formBuilderId": id,
        "theFormula": formula
      }); 
       toast.success("محاسبه گر با موفقیت ثبت شد");
    } catch (error) {
      toast.error("عملیات ناموفق بود مجددا امتحان فرمایید");
  };
}

  if (!isClient) return null;

  return (
    <Container maxWidth="sm" sx={{ mt: "35px" }}>
      <Typography variant="subtitle1" sx={{ display: "flex", justifyContent: "center", color: "#404040" }}>محاسبه گر</Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          paddingX: 1.5,
          direction: 'ltr',
          width: '100%',
        }}
      >
        <Stack spacing={1}>
          <Typography variant="subtitle2" color="#161616">نام:</Typography>
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
                padding: 1,
                height: "50px",
              },
            }}
            name="name"
            onChange={(e)=>setFormName(e.target.value)}
          />
        </Stack>

        <Box sx={{ width: "100%", display: "flex", flexDirection: { xs: "column", sm: "row" }, my: 3 }}>
          <Keypad
            handleFnFX={handleFnFX}
            handleNewField={handleNewField}
            handleParenthesis={handleParenthesis}
            handleOperator={handleOperator}
            handleNumber={handleNumber}
            handleUndo={handleUndo}
            contentEditable={contentEditable}
          />

          <Box sx={{ width: { xs: "100%", sm: "70%" }, display: "flex", flexDirection: "column", alignItems: "start" }}>
            <Typography variant="subtitle1" sx={{ display: "flex", justifyContent: "center", color: "#404040", fontWeight: 500 }}>اسکریپت:</Typography>
            <Stack spacing={4} sx={{ border: '1px solid #DDE1E6', borderRadius: 2, padding: 1, width: "100%", height: "100%", minHeight: 200, display: "flex", flexWrap: "wrap", flexDirection: "row" }}>
              <div
                contentEditable
                onClick={handleClick}
                ref={contentEditable}
                onKeyDown={handleKeyDown}
                suppressContentEditableWarning
                className={styles.ContentEditable}
              >
                {renderElements()}
              </div>
            </Stack>
          </Box>
        </Box>

        <Box display="flex" gap={3} width="100%" marginTop={5} marginBottom={2} sx={{ display: "flex", justifyContent: "center" }}>
          <LoadingButton
            type="button"
            onClick={() => {
              callApi()
            }}
            variant="contained"
            sx={{
              backgroundColor: "#1758BA",
              fontWeight: '500',
              fontSize: '15px',
              height: '50px',
              '&.MuiButtonBase-root:hover': {
                backgroundColor: "#1758BA",
              },
              minWidth: "132px",
              borderRadius: '8px'
            }}
          >
            <Typography variant="body2" component={'p'} py={0.5} sx={{ color: "#fff", fontWeight: 500 }}>
              تایید
            </Typography>
          </LoadingButton>

          <Button
            type="button"
            variant="outlined"
            sx={{ height: '50px', minWidth: "132px", fontWeight: '500', fontSize: '15px', borderColor: "#1758BA", background: "#F7F7FF",borderRadius: '8px' }}
          >
            <Typography variant="body2" component={'p'} py={0.5} color={"#1758BA"} sx={{ fontWeight: 500 }}>
              انصراف
            </Typography>
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AdvancedFormulaEditor;

