import React from "react";
import Keypad from "@/components/calculator/Keypad";

interface FormulaKeypadProps {
    handleFnFX: () => void;
    handleNewField: () => void;
    handleParenthesis: (content: string) => void;
    handleOperator: (content: string) => void;
    handleNumber: (content: string) => void;
    handleUndo: () => void;
    contentEditableRef: React.RefObject<HTMLDivElement>;
}

const FormulaKeypad: React.FC<FormulaKeypadProps> = ({
                                                         handleFnFX,
                                                         handleNewField,
                                                         handleParenthesis,
                                                         handleOperator,
                                                         handleNumber,
                                                         handleUndo,
                                                         contentEditableRef,
                                                     }) => {
    return (<Keypad
            handleFnFX={handleFnFX}
            handleNewField={handleNewField}
            handleParenthesis={handleParenthesis}
            handleOperator={handleOperator}
            handleNumber={handleNumber}
            handleUndo={handleUndo}
            contentEditable={contentEditableRef}
        />);
};

export default FormulaKeypad;
