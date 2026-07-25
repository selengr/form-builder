'use client';

import KeypadPanel from './KeypadPanel';

interface KeypadProps {
  handleFnFX: () => void;
  handleNewField: () => void;
  handleParenthesis: (content: string) => void;
  handleOperator: (op: string) => void;
  handleNumber: (num: string) => void;
  handleUndo: () => void;
  contentEditable: React.RefObject<HTMLDivElement>;
}

const Keypad: React.FC<KeypadProps> = (props) => {
  return <KeypadPanel {...props} variant="desktop" />;
};

export default Keypad;
