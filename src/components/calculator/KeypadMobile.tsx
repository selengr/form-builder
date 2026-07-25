'use client';

import KeypadPanel from './KeypadPanel';

interface KeypadMobileProps {
  handleFnFX: () => void;
  handleNewField: () => void;
  handleParenthesis: (content: string) => void;
  handleOperator: (op: string) => void;
  handleNumber: (num: string) => void;
  handleUndo: () => void;
  contentEditable: React.RefObject<HTMLDivElement>;
}

const KeypadMobile: React.FC<KeypadMobileProps> = (props) => {
  return <KeypadPanel {...props} variant="mobile" />;
};

export default KeypadMobile;
