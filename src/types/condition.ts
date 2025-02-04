
  
  export interface IConditionExtMap {
    QUESTION_TYPE?: string;
    DESCRIPTION?: string;
    MAXIMUM_LEN?: string;
    UNIC_NAME?: string;
    REQUIRED?: string;
    MINIMUM_LEN?: string;
    TEXT_FIELD_PATTERN?: string;
    MULTI_SELECT?: string;
    OPTIONS?: {
      [key: string]: [number, string];
    };
    OPTIONS_SIZE?: number;
    FORMULA?: string;
  }
  
  export interface IConditionQuestionType {
    value: string;
    caption: string;
    elementStr: string;
    extMap: IConditionExtMap;
  }
  
  export interface IConditionSelectOption {
    value: string;
    label: string;
  }

  
  export interface IConditionForm {
    questionType: string;
    operatorType: string;
    conditionType: string;
    inputValue: string | number;
  }
  
  export type IConditionFormAction =
    | { type: 'SET_QUESTION_TYPE'; payload: string }
    | { type: 'SET_OPERATOR_TYPE'; payload: string }
    | { type: 'SET_CONDITION_TYPE'; payload: string }
    | { type: 'SET_INPUT_VALUE'; payload: string | number };
  
  