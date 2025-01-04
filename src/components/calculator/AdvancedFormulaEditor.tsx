"use client";

import { toast } from "sonner";
import Keypad from "./Keypad";
import { LoadingButton } from "@mui/lab";
import styles from "./advancedFormulaEditor.module.css";

import { useParams, useRouter } from "next/navigation";
import AxiosApi from "@/services/axios/AxiosApi";
import { htmlToFormula } from "../../lib/htmlToFormula";
import { Element, FnFxItem } from "../../types/formulaEditor";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { IAdvancedFormulaEditorProps } from "@/types/calculator";


const AdvancedFormulaEditor: React.FC<IAdvancedFormulaEditorProps> = ({ questionList, handleClose, editList, isEdit }) => {
  const { id } = useParams();
  const editData = editList?.frontCalcData ? JSON.parse(editList.frontCalcData as string) : []
  const [formName, setFormName] = useState<string>(editList?.name ?? "");
  const [cursorIndex, setCursorIndex] = useState<number>(0);
  const [elements, setElements] = useState<Element[]|[]>(editData);
  const [isClient, setIsClient] = useState<boolean>(false);

  const {refresh} = useRouter()


  useEffect(() => {
    setIsClient(true);
  }, []);

  const contentEditable = useRef<HTMLDivElement>(null);
  const selectAvgRef = useRef<{ [key: string]: string }>({});
  const selectFieldRef = useRef<{ [key: string]: string }>({});

  const handleUndo = useCallback(() => {
    if (elements.length === 0 || cursorIndex === 0) return;

    if (elements[cursorIndex - 1].type === "AVG_PARENTHESIS") {
      return;
    }

    const newElements = [...elements];

    if (elements[cursorIndex - 1].type === "NEW_FnFx") {
      let endIndex = cursorIndex - 1;
      let parenthesisCount = 0;

      for (let i = cursorIndex; i < elements.length; i++) {
        if (elements[i].type === "AVG_PARENTHESIS") {
          if (elements[i].content === "(") {
            parenthesisCount++;
          } else if (elements[i].content === ")") {
            if (parenthesisCount === 1) {
              endIndex = i;
              break;
            }
            parenthesisCount--;
          }
        }
      }
      newElements.splice(cursorIndex - 1, endIndex - cursorIndex + 2);
    } else {
      newElements.splice(cursorIndex - 1, 1);
    }

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
          range.setStartAfter(
            editableDiv.childNodes[newCursorIndex - 1] || editableDiv
          );
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
    const operatorTypes = ["-", "+", "*", "/"];
    let newCursorIndex = cursorIndex;

    if (
      cursorIndex > 0 &&
      newElements[cursorIndex - 1].type === "OPERATOR" &&
      operatorTypes.includes(newElements[cursorIndex - 1].content)
    ) {
      newElements[cursorIndex - 1] = { type: "OPERATOR", content };
    } else {
      newElements.splice(cursorIndex, 0, { type: "OPERATOR", content });
      newCursorIndex++;
    }

    updateElements(newElements, newCursorIndex);
  };

  const handleNumber = (content: string) => {
    const newElements: Element[] = [...elements];
    let newCursorIndex = cursorIndex;

    if (cursorIndex > 0 && newElements[cursorIndex - 1].type === "NUMBER") {
      newElements[cursorIndex - 1].content += content;
    } else {
      newElements.splice(cursorIndex, 0, { type: "NUMBER", content });
      newCursorIndex++;
    }

    updateElements(newElements, newCursorIndex);
  };

  const handleParenthesis = (content: string) => {
    const newElements = [...elements];
    let newCursorIndex = cursorIndex;
    if (content === "(") {
      newElements.splice(cursorIndex, 0, { type: "PARENTHESIS", content: "(" });
      newElements.splice(cursorIndex + 1, 0, {
        type: "PARENTHESIS",
        content: ")",
      });
      newCursorIndex++;
    } else if (content === ")") {
      newElements.splice(cursorIndex, 0, { type: "PARENTHESIS", content: ")" });
      newCursorIndex++;
    }
    updateElements(newElements, newCursorIndex);
  };

  const handleDropdownClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const optionsContainer = (e.target as HTMLElement)
      .nextElementSibling as HTMLElement;
    const isHidden = optionsContainer.style.display === "none";
    optionsContainer.style.display = isHidden ? "block" : "none";
    (e.target as HTMLElement).setAttribute(
      "data-type",
      isHidden ? "up" : "down"
    );
  };

  const handleOptionClick = (item: any, id: string) => {
    const { UNIC_NAME, STICKY_FUNC } = item.extMap;
    const newElements = elements.map((elem) =>
      elem.id === id
        ? { ...elem, content: item.caption, id: STICKY_FUNC ?? UNIC_NAME }
        : elem
    );

    setElements(newElements);
    selectFieldRef.current[STICKY_FUNC || UNIC_NAME] = STICKY_FUNC || UNIC_NAME;

    const optionsContainer = document.querySelector(
      `[data-id="${id}"] .${styles.optionsContainer}`
    ) as HTMLElement;
    if (optionsContainer) {
      optionsContainer.style.display = "none";
    }

    const dropdownButton = document.querySelector(
      `[data-id="${id}"] .${styles.customDropdown}`
    ) as HTMLElement;
    if (dropdownButton) {
      dropdownButton.setAttribute("data-type", "down");
    }
  };

  const handleNewField = () => {
    const editableDiv = contentEditable.current;
    if (!editableDiv) return;

    const selectId = `select_${Date.now()}`;
    const newElement: Element = {
      type: "NEW_FIELD",
      content: "انتخاب سوال",
      id: selectId,
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
      if (elem.type === "NEW_FIELD") {
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
            <div
              className={styles.optionsContainer}
              style={{ display: "none" }}
            >
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
      } else if (elem.type === "NEW_FnFx") {
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
            <div
              className={styles.optionsContainer}
              style={{ display: "none" }}
            >
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
    async function getData() {
      if (elements) {
        for (const elem of elements) {
          if (elem.type === "NEW_FIELD") {
            questionList.dataList.forEach((item: any) => {
              const { UNIC_NAME, STICKY_FUNC } = item.extMap;
              if (UNIC_NAME === elem.id || STICKY_FUNC === elem.id) {
                selectFieldRef.current[elem.id as string] = STICKY_FUNC || UNIC_NAME;
              }
            });
          }
        }
        setElements(elements);
      }
    }

    if (isEdit) getData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(`.${styles.NEW_FIELD}`) &&
        !target.closest(`.${styles.NEW_FnFx}`)
      ) {
        const allOptionContainers = document.querySelectorAll(
          `.${styles.optionsContainer}`
        );
        allOptionContainers.forEach((container: any) => {
          (container as HTMLElement).style.display = "none";
        });
        const allDropdowns = document.querySelectorAll(
          `.${styles.customDropdown}`
        );
        allDropdowns.forEach((dropdown: any) => {
          dropdown.setAttribute("data-type", "down");
        });
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [styles]);

  const handleFnFXDropdownClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const optionsContainer = (e.target as HTMLElement)
      .nextElementSibling as HTMLElement;
    const isHidden = optionsContainer.style.display === "none";
    optionsContainer.style.display = isHidden ? "block" : "none";
    (e.target as HTMLElement).setAttribute(
      "data-type",
      isHidden ? "up" : "down"
    );
  };

  const handleFnFXOptionClick = (item: FnFxItem, id: string) => {
    const newElements = elements.map((elem) =>
      elem.id === id ? { ...elem, content: item.fnCaption } : elem
    );
    setElements(newElements);
    selectAvgRef.current[id] = item.fnValue;

    const optionsContainer = document.querySelector(
      `[data-id="${id}"] .${styles.optionsContainer}`
    ) as HTMLElement;
    if (optionsContainer) {
      optionsContainer.style.display = "none";
    }

    const dropdownButton = document.querySelector(
      `[data-id="${id}"] .${styles.customDropdown}`
    ) as HTMLElement;
    if (dropdownButton) {
      dropdownButton.setAttribute("data-type", "down");
    }
  };

  const handleFnFX = () => {
    const editableDiv = contentEditable.current;
    if (!editableDiv) return;

    const selectId = `select_${Date.now()}`;
    const newElement: Element = {
      type: "NEW_FnFx",
      content: "میانگین()",
      id: selectId,
    };

    const newElements = [...elements];
    newElements.splice(cursorIndex, 0, newElement);
    newElements.splice(cursorIndex + 1, 0, {
      type: "AVG_PARENTHESIS",
      content: "(",
    });
    newElements.splice(cursorIndex + 2, 0, {
      type: "AVG_PARENTHESIS",
      content: ")",
    });

    setElements(newElements);
    selectAvgRef.current[selectId] = "#avgNumber";

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
    // if (
    //   !/^[0-9+\-*/().()]$/.test(event.key) &&
    //   !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(
    //     event.key
    //   )
    // ) {
    //   event.preventDefault();
    // }
    if (event.key === "Enter") {
      event.preventDefault();
    }
    if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      handleUndo();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const editableDiv = contentEditable.current;
    if (editableDiv) {
      const range = document.caretRangeFromPoint(e.clientX, e.clientY);
      if (range) {
        const index = Array.from(editableDiv.childNodes).findIndex(
          (node, index) => index === range.endOffset
        );
        setCursorIndex(index === -1 ? elements.length : index);
      }
    }
  };

  const callApi = async () => {
    let formula = "";
    const newFormula = htmlToFormula(elements, selectFieldRef, selectAvgRef);
    if (!!!formName) return toast.error("ابتدا نام محاسبه گر را وارد کنید");
    if (!!!newFormula) return toast.error("هیج محاسبه ای افزوده نشده");
    if (newFormula.includes("undefined"))
      return toast.error("سوال انتخاب نشده دارید");

    const avgNum = newFormula.split("#avg");
    avgNum.map((item) => {
      if (item.includes("Number")) {
        formula += "#avg" + item?.replaceAll("}{", "},{");
      } else {
        formula += item;
      }
    });

    try {
       await AxiosApi.post(`/calculation`, {
        name: formName,
        formBuilderId: id,
        theFormula: formula,
        frontCalcData: JSON.stringify(elements),
      });
      handleClose()
      refresh()
      toast.success("محاسبه گر با موفقیت ثبت شد");
    } catch (error) {
      toast.error("عملیات ناموفق بود مجددا امتحان فرمایید");
    }
  };

  if (!isClient) return null;

  return (
    <Container
      maxWidth="sm"
      sx={{ paddingX: "0px !important", marginTop: "-15px !important" }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          display: "flex",
          justifyContent: "center",
          color: "#404040",
          fontWeight: 700,
        }}
      >
        محاسبه گر
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          // paddingX: 1.5,
          direction: "ltr",
          width: "100%",
        }}
      >
        <Stack spacing={1}>
          <Typography variant="subtitle2" color="#161616">
            نام:
          </Typography>
          <TextField
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#DDE1E6",
                  borderRadius: "8px",
                },
                "&:hover fieldset": {
                  borderColor: "#DDE1E6",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#DDE1E6",
                },
              },
              "& input": {
                paddingX: 1,
                paddingY: 0,
                height: "50px",
              },
            }}
            name="name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
        </Stack>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            my: 3,
          }}
        >
          <Keypad
            handleFnFX={handleFnFX}
            handleNewField={handleNewField}
            handleParenthesis={handleParenthesis}
            handleOperator={handleOperator}
            handleNumber={handleNumber}
            handleUndo={handleUndo}
            contentEditable={contentEditable}
          />

          <Box
            sx={{
              width: { xs: "100%", sm: "73%" },
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                justifyContent: "center",
                color: "#404040",
                fontWeight: 500,
              }}
            >
              اسکریپت:
            </Typography>
            <Stack
              spacing={4}
              sx={{
                border: "1px solid #DDE1E6",
                borderRadius: 2,
                padding: 1,
                width: "100%",
                height: "100%",
                minHeight: 200,
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row",
              }}
            >
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

        {/* {error &&
    <Stack spacing={1}>
    <Typography variant="subtitle2" color="error">{error}</Typography>
    </Stack>
    } */}

        <Box
          display="flex"
          gap={3}
          width="100%"
          marginBottom={2}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <LoadingButton
            type="button"
            onClick={() => {
              callApi();
            }}
            variant="contained"
            sx={{
              backgroundColor: "#1758BA",
              fontWeight: "500",
              fontSize: "15px",
              borderRadius: "8px",
              height: "50px",
              "&.MuiButtonBase-root:hover": {
                backgroundColor: "#1758BA",
              },
              minWidth: "132px",
            }}
          >
            <Typography
              variant="body2"
              component={"p"}
              py={0.5}
              sx={{ color: "#fff", fontWeight: 500 }}
            >
              تایید
            </Typography>
          </LoadingButton>

          <Button
            type="button"
            variant="outlined"
            sx={{
              height: "50px",
              minWidth: "132px",
              fontWeight: "500",
              borderRadius: "8px",
              fontSize: "15px",
              borderColor: "#1758BA",
              background: "#F7F7FF",
            }}
            onClick={handleClose}
          >
            <Typography
              variant="body2"
              component={"p"}
              py={0.5}
              color={"#1758BA"}
              sx={{ fontWeight: 500 }}
            >
              انصراف
            </Typography>
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AdvancedFormulaEditor;
