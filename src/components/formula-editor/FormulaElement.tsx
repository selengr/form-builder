"use client";
import React from "react";
import styles from "@/components/calculator/advancedFormulaEditor.module.css";
import { Element } from "./types";
import FormulaFieldDropdown from "./FormulaFieldDropdown";
import FormulaFnDropdown from "./FormulaFnDropdown";

interface FormulaElementProps {
  element: Element ;
  index: number;
  questionList: any;
  onFieldSelect: (item: any, id: string, element: any) => void;
  onFieldClick: (e: React.MouseEvent, id: string, index: any) => void;
  onFnSelect: (item: any, id: string) => void;
  onFnClick: (e: React.MouseEvent, id: string) => void;
}

const FormulaElement: React.FC<FormulaElementProps> = ({
                                                         element,
                                                         index,
                                                         questionList,
                                                         onFieldSelect,
                                                         onFieldClick,
                                                         onFnSelect,
                                                         onFnClick,
                                                       }) => {
  const elementKey = `${element.type}_${element.mainIndex ?? index}`;

  switch (element.type) {
    case "NEW_FIELD":
      return (
        <FormulaFieldDropdown
          element={element}
          options={questionList.dataList}
          onSelect={onFieldSelect}
          onClick={onFieldClick}
        />
      );
    case "NEW_FnFx":
      return (
        <FormulaFnDropdown
          element={element}
          options={[{fnValue: "avg", fnCaption: "میانگین()"}]}
          onSelect={onFnSelect}
          onClick={onFnClick}
        />
      );
    default:
      return (
        <div
          key={elementKey}
          contentEditable={false}
          className={`${styles.dynamicbtn} ${styles[element.type]}`}
          data-type={element.type}
        >
          {element.content}
        </div>
      );
  }
};

export default FormulaElement;
