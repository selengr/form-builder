import React from 'react';
import { useMediaQuery } from '@mui/material';
import Keypad from '@/components/calculator/Keypad';
import KeypadMobile from '../calculator/KeypadMobile';

interface FormulaKeypadProps {
  handleFnFX: () => void;
  handleNewField: () => void;
  handleParenthesis: (content: string) => void;
  handleOperator: (content: string) => void;
  handleNumber: (content: string) => void;
  handleUndo: () => void;
  contentEditableRef: React.RefObject<HTMLDivElement>;
}

const FormulaKeypad: React.FC<FormulaKeypadProps> = ({ handleFnFX, handleNewField, handleParenthesis, handleOperator, handleNumber, handleUndo, contentEditableRef }) => {
  const isDesktop = useMediaQuery('(min-width:768px)');
  return (
    <>
      {isDesktop && <Keypad
        handleFnFX={handleFnFX}
        handleNewField={handleNewField}
        handleParenthesis={handleParenthesis}
        handleOperator={handleOperator}
        handleNumber={handleNumber}
        handleUndo={handleUndo}
        contentEditable={contentEditableRef}
      />
      }
      {!isDesktop && <KeypadMobile
        handleFnFX={handleFnFX}
        handleNewField={handleNewField}
        handleParenthesis={handleParenthesis}
        handleOperator={handleOperator}
        handleNumber={handleNumber}
        handleUndo={handleUndo}
        contentEditable={contentEditableRef}
      />
      }
    </>
  );
};

export default FormulaKeypad;
