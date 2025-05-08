export type Element = {
  type: "NEW_FIELD" | "NUMBER" | "OPERATOR" | "PARENTHESIS" | "NEW_FnFx" | "AVG_PARENTHESIS";
  content: string;
  id?: string;
  mainIndex?: number;
};

export type FnFxItem = {
  fnValue: string;
  fnCaption: string;
};

export interface IAdvancedFormulaEditorProps {
  questionList: any;
  handleClose: () => void;
  editList?: any;
  isEdit?: boolean;
}

export type DropdownOption = {
  value: string;
  label: string;
};
