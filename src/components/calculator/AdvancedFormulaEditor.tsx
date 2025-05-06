"use client";

import {toast} from "sonner";
import Keypad from "./Keypad";
import styles from "./advancedFormulaEditor.module.css";
import {useParams, useRouter} from "next/navigation";
import AxiosApi from "@/services/axios/AxiosApi";
import {htmlToFormula} from "@/lib/htmlToFormula";
import {Element, FnFxItem} from "@/types/formulaEditor";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {Box, Button, Container, Stack, TextField, Typography} from "@mui/material";
import {IAdvancedFormulaEditorProps} from "@/types/calculator";

const AdvancedFormulaEditor: React.FC<IAdvancedFormulaEditorProps> = ({
                                                                          questionList,
                                                                          handleClose,
                                                                          editList,
                                                                          isEdit,
                                                                      }) => {
    const {id} = useParams();
    const {refresh} = useRouter();
    const mainIndex = useRef<number>(-2);

    const editData = editList?.frontCalcData ? JSON.parse(editList.frontCalcData as string) : [];
    const [formName, setFormName] = useState<string>(editList?.name ?? "");
    const [cursorIndex, setCursorIndex] = useState<number>(0);
    const [elements, setElements] = useState<Element[]>(editData);
    const [isClient, setIsClient] = useState<boolean>(false);

    const contentEditable = useRef<HTMLDivElement>(null);
    const selectAvgRef = useRef<Record<string, string>>({});
    const selectFieldRef = useRef<Record<string, string>>({});

    const OPERATOR_TYPES = ["-", "+", "*", "/"];
    const FN_FX_OPTIONS = [{fnValue: "avg", fnCaption: "میانگین()"}];

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isEdit) {
            initializeFieldRefs();
        }
    }, [isEdit]);

    const initializeFieldRefs = () => {
        if (!elements) return;

        elements.forEach((elem) => {
            if (elem.type === "NEW_FIELD") {
                questionList.dataList.forEach((item: any) => {
                    const {UNIC_NAME, STICKY_FUNC} = item.extMap;
                    if (UNIC_NAME === elem.id || STICKY_FUNC === elem.id) {
                        selectFieldRef.current[elem.id as string] = STICKY_FUNC || UNIC_NAME;
                    }
                });
            }
        });
    };

    const isLastElementOperand = () => {
        if (elements.length === 0) return false;
        const lastElement = elements[elements.length - 1];
        return (lastElement.type === "NEW_FIELD" || lastElement.type === "NUMBER" || lastElement.type === "NEW_FnFx");
    };

    const updateCursorPosition = (newCursorIndex: number) => {
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
            }
            else {
                const targetNode = editableDiv.childNodes[newCursorIndex];
                range.setStartBefore(targetNode);
            }

            range.collapse(true);
            sel?.removeAllRanges();
            sel?.addRange(range);
            editableDiv.focus();
            editableDiv.style.caretColor = '#1758BA';
        }, 10);
    };

    const updateElements = (newElements: Element[], newCursorIndex: number) => {
        setElements(newElements);
        setCursorIndex(newCursorIndex);
        updateCursorPosition(newCursorIndex);
    };

    const isValidParenthesisPosition = (content: string): boolean => {
        if (content === "(") {
            if (cursorIndex === 0) return true;
            const prevElement = elements[cursorIndex - 1];
            return (
              prevElement.type === "OPERATOR" ||
              (prevElement.type === "PARENTHESIS" && prevElement.content === "(") ||
              (prevElement.type === "AVG_PARENTHESIS" && prevElement.content === "(")
            );
        } else {
            if (cursorIndex === 0) return false;
            const prevElement = elements[cursorIndex - 1];
            return (
              prevElement.type === "NEW_FIELD" ||
              prevElement.type === "NUMBER" ||
              prevElement.type === "NEW_FnFx" ||
              (prevElement.type === "PARENTHESIS" && prevElement.content === ")") ||
              (prevElement.type === "AVG_PARENTHESIS" && prevElement.content === ")")
            );
        }
    };

    const handleUndo = useCallback(() => {
        if (elements.length === 0 || cursorIndex === 0) return;
        if (elements[cursorIndex - 1].type === "AVG_PARENTHESIS") return;

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
            mainIndex.current += -2
        } else {
            newElements.splice(cursorIndex - 1, 1);
        }

        updateElements(newElements, Math.max(0, cursorIndex - 1));
    }, [elements, cursorIndex]);

    const handleOperator = (content: string) => {
        const newElements = [...elements];
        let newCursorIndex = cursorIndex;

        if (!isValidCursorPosition(cursorIndex, true)) {
            toast.error("امکان اضافه کردن عملگر در این موقعیت وجود ندارد");
            return;
        }

        if (cursorIndex === 0) {
            toast.error("فرمول نمی‌تواند با عملگر شروع شود");
            return;
        }

        const prevElement = cursorIndex > 0 ? elements[cursorIndex - 1] : null;
        const nextElement = cursorIndex < elements.length ? elements[cursorIndex] : null;

        if (prevElement) {
            if (prevElement.type === "OPERATOR") {
                toast.error("عملگر نمی‌تواند بعد از عملگر دیگر قرار گیرد");
                return;
            }

            if ((prevElement.type === "PARENTHESIS" || prevElement.type === "AVG_PARENTHESIS") &&
              prevElement.content === "(") {
                toast.error("عملگر نمی‌تواند بلافاصله بعد از پرانتز باز قرار گیرد");
                return;
            }
        }

        if (nextElement) {
            if ((nextElement.type === "PARENTHESIS" || nextElement.type === "AVG_PARENTHESIS") &&
              nextElement.content === ")") {
                toast.error("عملگر نمی‌تواند بلافاصله قبل از پرانتز بسته قرار گیرد");
                return;
            }

            if (nextElement.type === "OPERATOR") {
                toast.error("دو عملگر نمی‌توانند پشت سر هم قرار گیرند");
                return;
            }
        }

        if (cursorIndex > 0 &&
          newElements[cursorIndex - 1].type === "OPERATOR" &&
          OPERATOR_TYPES.includes(newElements[cursorIndex - 1].content)) {
            newElements[cursorIndex - 1].content = content;
        }
        else {
            newElements.splice(cursorIndex, 0, {type: "OPERATOR", content});
            newCursorIndex++;
        }

        updateElements(newElements, newCursorIndex);
    };

    const canAddNumber = (content: string): boolean => {
        if (cursorIndex > 0 && elements[cursorIndex - 1].type === "NUMBER") {
            return true;
        }

        const prevElement = cursorIndex > 0 ? elements[cursorIndex - 1] : null;
        const nextElement = cursorIndex < elements.length ? elements[cursorIndex] : null;

        if (prevElement) {
            if (prevElement.type === "NUMBER") {
                return false;
            }

            if (!(prevElement.type === "OPERATOR" ||
              (prevElement.type === "PARENTHESIS" && prevElement.content === "(") ||
              (prevElement.type === "AVG_PARENTHESIS" && prevElement.content === "("))) {
                return false;
            }
        }

        if (nextElement) {
            if (nextElement.type === "NUMBER") {
                return false;
            }
        }

        return true;
    };

    const handleNumber = (content: string) => {
        if (!canAddNumber(content)) {
            toast.error("امکان اضافه کردن عدد در این موقعیت وجود ندارد");
            return;
        }

        const newElements = [...elements];
        let newCursorIndex = cursorIndex;

        if (cursorIndex > 0 && newElements[cursorIndex - 1].type === "NUMBER") {
            const currentNumber = newElements[cursorIndex - 1].content;

            if (content === ".") {
                if (currentNumber.includes(".")) {
                    toast.error("عدد نمی‌تواند بیش از یک ممیز اعشار داشته باشد");
                    return;
                }
                newElements[cursorIndex - 1].content += content;
            }
            else if (currentNumber === "0" && content !== ".") {
                newElements[cursorIndex - 1].content = content;
            }
            else if (currentNumber === ".") {
                newElements[cursorIndex - 1].content = `0.${content}`;
            }
            else {
                newElements[cursorIndex - 1].content += content;
            }
        }
        else {
            if (content === ".") {
                newElements.splice(cursorIndex, 0, {type: "NUMBER", content: "0."});
            } else {
                newElements.splice(cursorIndex, 0, {type: "NUMBER", content});
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

        if (content === "(") {
            newElements.splice(cursorIndex, 0, {type: "PARENTHESIS", content: "("});
            newCursorIndex++;
        } else if (content === ")") {
            newElements.splice(cursorIndex, 0, {type: "PARENTHESIS", content: ")"});
            newCursorIndex++;
        }

        updateElements(newElements, newCursorIndex);
    };

    const toggleDropdown = (element: HTMLElement, isHidden: boolean) => {
        const optionsContainer = element.nextElementSibling as HTMLElement;
        optionsContainer.style.display = isHidden ? "block" : "none";
        element.setAttribute("data-type", isHidden ? "up" : "down");
    };

    const handleDropdownClick = (e: React.MouseEvent, id: string,index:any) => {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        const isHidden = target.getAttribute("data-type") === "down";
        toggleDropdown(target, isHidden);
    };

    const handleOptionClick = (item: any, dropdownId: string, element: any) => {
        const {UNIC_NAME, STICKY_FUNC} = item.extMap;
        const finalId = STICKY_FUNC ?? UNIC_NAME;

        const elementIndex = elements.findIndex(elem => elem.id === dropdownId);
        if (elementIndex === -1) return;
        const newElements = [...elements];

        newElements[elementIndex] = {
            type: "NEW_FIELD",
            content: item.caption,
            id: finalId,
            mainIndex: element.mainIndex
        };

        setElements(newElements);
        selectFieldRef.current[finalId] = finalId;
        closeDropdown(dropdownId);

        setCursorIndex(elementIndex + 1);
        updateCursorPosition(elementIndex + 1);
    };

    const closeDropdown = (id: string) => {
        const optionsContainer = document.querySelector(`[data-id="${id}"] .${styles.optionsContainer}`) as HTMLElement;
        const dropdownButton = document.querySelector(`[data-id="${id}"] .${styles.customDropdown}`) as HTMLElement;

        if (optionsContainer) optionsContainer.style.display = "none";
        if (dropdownButton) dropdownButton.setAttribute("data-type", "down");
    };

    const canAddField = (): boolean => {
        if (elements.length === 0) return true;

        const prevElement = cursorIndex > 0 ? elements[cursorIndex - 1] : null;
        const nextElement = cursorIndex < elements.length ? elements[cursorIndex] : null;

        if (prevElement) {
            if (prevElement.type === "NEW_FIELD" ||
              prevElement.type === "NUMBER" ||
              prevElement.type === "NEW_FnFx") {
                return false;
            }
        }

        if (nextElement) {
            if (nextElement.type === "NEW_FIELD" ||
              nextElement.type === "NUMBER" ||
              nextElement.type === "NEW_FnFx") {
                return false;
            }
        }

        return true;
    };

    const handleNewField = () => {
        if (!isValidCursorPosition(cursorIndex, true)) {
            toast.error("امکان اضافه کردن فیلد در این موقعیت وجود ندارد");
            return;
        }

        if (!canAddField()) {
            toast.error("فیلد جدید فقط می‌تواند بعد از پرانتز باز یا عملگر اضافه شود");
            return;
        }

        mainIndex.current += 2;
        const selectId = `select_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const newElement: Element = {
            type: "NEW_FIELD",
            content: "انتخاب سوال",
            id: selectId,
            mainIndex: mainIndex.current
        };

        const newElements = [...elements];
        newElements.splice(cursorIndex, 0, newElement);
        updateElements(newElements, cursorIndex + 1);
    };

    const handleFnFXDropdownClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        const isHidden = target.getAttribute("data-type") === "down";
        toggleDropdown(target, isHidden);
    };

    const handleFnFXOptionClick = (item: FnFxItem, id: string) => {
        const newElements = elements.map((elem) => elem.id === id ? {...elem, content: item.fnCaption} : elem);
        setElements(newElements);
        selectAvgRef.current[id] = item.fnValue;
        closeDropdown(id);
    };

    const handleFnFX = () => {
        const editableDiv = contentEditable.current;
        if (!editableDiv) return;

        if (isLastElementOperand()) {
            toast.error("لطفاً ابتدا یک عملگر وارد کنید");
            return;
        }

        const selectId = `select_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const newElements = [...elements];

        newElements.splice(cursorIndex, 0, {
            type: "NEW_FnFx",
            content: "میانگین()",
            id: selectId
        }, {type: "AVG_PARENTHESIS", content: "("}, {type: "AVG_PARENTHESIS", content: ")"});

        setElements(newElements);
        selectAvgRef.current[selectId] = "#avgNumber";
        updateElements(newElements, cursorIndex + 2);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            return;
        }

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
        if (!editableDiv) return;

        const clickX = e.clientX;
        const clickY = e.clientY;
        const elements = Array.from(editableDiv.children);

        let closestElement = null;
        let closestDistance = Infinity;
        let closestIndex = -1;

        elements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distance = Math.sqrt(
              Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2));
            if (distance < closestDistance) {
                closestDistance = distance;
                closestElement = element;
                closestIndex = index;
            }
        });

        if (closestElement && closestIndex !== -1) {
            // @ts-ignore
            const rect = closestElement.getBoundingClientRect();
            const isClickOnRightHalf = clickX > rect.left + rect.width / 2;
            setCursorIndex(isClickOnRightHalf ? closestIndex + 1 : closestIndex);
            updateCursorPosition(isClickOnRightHalf ? closestIndex + 1 : closestIndex);
        } else {
            setCursorIndex(elements.length);
            updateCursorPosition(elements.length);
        }
    };

    const isValidCursorPosition = (index: number, forInsertion: boolean = false): boolean => {
        const prevElement = index > 0 ? elements[index - 1] : null;
        const nextElement = index < elements.length ? elements[index] : null;

        if (!forInsertion) {
            return !(prevElement?.type === "OPERATOR" && nextElement?.type === "OPERATOR");
        }

        if (prevElement?.type === "OPERATOR" && nextElement?.type === "OPERATOR") {
            return false;
        }

        return !(prevElement?.type === "PARENTHESIS" && prevElement?.content === "(" &&
          nextElement?.type === "OPERATOR");
    };

    const callApi = async () => {
        if (!formName) return toast.error("ابتدا نام محاسبه گر را وارد کنید");

        const newFormula = htmlToFormula(elements, selectFieldRef, selectAvgRef);
        if (!newFormula) return toast.error("هیج محاسبه ای افزوده نشده");
        if (newFormula.includes("undefined")) return toast.error("سوال انتخاب نشده دارید");

        let formula = "";
        const avgNum = newFormula.split("#avg");
        avgNum.forEach((item) => {
            formula += item.includes("Number") ? `#avg${item.replaceAll("}{", "},{")}` : item;
        });

        try {
            if (!isEdit) {
                await AxiosApi.post("/calculation", {
                    name: formName, formBuilderId: id, theFormula: formula, frontCalcData: JSON.stringify(elements),
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
            handleClose();
            refresh();
            toast.success("محاسبه گر با موفقیت ثبت شد");
        } catch (error) {
            toast.error("عملیات ناموفق بود مجددا امتحان فرمایید");
        }
    };

    const generateStableKey = (elem: Element, index: number) => {
        if (elem.mainIndex !== undefined) {
            return `${elem.type}_${elem.mainIndex}`;
        }
        return `${elem.type}_${index}`;
    };

    const renderElement = (elem: Element, index: number) => {
        const elementKey = generateStableKey(elem, index);

        switch (elem.type) {
            case "NEW_FIELD":
                return (<div
                  key={elementKey}
                  data-id={elem.mainIndex}
                  contentEditable={false}
                  className={`${styles.dynamicbtn} ${styles.NEW_FIELD}`}
                  data-type="NEW_FIELD"
                >
                    <div
                      className={styles.customDropdown}
                      data-type="down"
                      onClick={(e) => handleDropdownClick(e, elem.id!,index)}
                    >
                        {elem.content}
                    </div>
                    <div className={styles.optionsContainer} style={{display: "none"}}>
                        {questionList.dataList.map((item: any, index: number) => (<div
                          key={index}
                          className={styles.option}
                          onClick={() => handleOptionClick(item, elem.id!,elem)}
                        >
                            {item.caption}
                        </div>))}
                    </div>
                </div>);

            case "NEW_FnFx":
                return (<div
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
                    <div className={styles.optionsContainer} style={{display: "none"}}>
                        {FN_FX_OPTIONS.map((item) => (<div
                          key={item.fnValue}
                          className={styles.option}
                          onClick={() => handleFnFXOptionClick(item, elem.id!)}
                        >
                            {item.fnCaption}
                        </div>))}
                    </div>
                </div>);

            default:
                return (<div
                  key={index}
                  contentEditable={false}
                  className={`${styles.dynamicbtn} ${styles[elem.type]}`}
                  data-type={elem.type}
                >
                    {elem.content}
                </div>);
        }
    };

    const renderElements = useCallback(() => elements.map(renderElement), [elements]);

    if (!isClient) return null;

    return (
      <Container
        maxWidth="sm"
        sx={{padding: "0px !important", marginTop: "-15px !important"}}
      >
          <Typography
            variant="subtitle1"
            sx={{
                display: "flex", justifyContent: "center", color: "#404040", fontWeight: 700,
            }}
          >
              محاسبه‌گر
          </Typography>

          <Box
            sx={{
                display: "flex", flexDirection: "column", height: "100%", direction: "ltr", width: "100%",
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
                                borderColor: "#DDE1E6", borderRadius: "8px",
                            }, "&:hover fieldset": {
                                borderColor: "#DDE1E6",
                            }, "&.Mui-focused fieldset": {
                                borderColor: "#DDE1E6",
                            },
                        }, "& input": {
                            paddingX: 1, paddingY: 0, height: "50px",
                        },
                    }}
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
              </Stack>

              <Box
                sx={{
                    width: "100%", display: "flex", flexDirection: {xs: "column", sm: "row"}, my: 3,
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
                        width: {xs: "100%", sm: "73%"},
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                    }}
                  >
                      <Typography
                        variant="subtitle1"
                        sx={{
                            display: "flex", justifyContent: "center", color: "#404040", fontWeight: 500,
                        }}
                      >
                          اسکریپت:
                      </Typography>
                      <Stack
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

              <Box
                display="flex"
                gap={3}
                width="100%"
                marginBottom={2}
                sx={{justifyContent: "center"}}
              >
                  <Button
                    onClick={callApi}
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
                        py={0.5}
                        sx={{color: "#fff", fontWeight: 500}}
                      >
                          تایید
                      </Typography>
                  </Button>

                  <Button
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
                        py={0.5}
                        color="#1758BA"
                        sx={{fontWeight: 500}}
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
