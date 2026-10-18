export type Element = {
  type: 'NEW_FIELD' | 'NUMBER' | 'OPERATOR' | 'PARENTHESIS' | 'NEW_FnFx' | 'AVG_PARENTHESIS';
  content: string;
  id?: string;
  mainIndex?: number;
  isInAvg?: any;
};

export type FnFxItem = {
  fnValue: string;
  fnCaption: string;
};

interface IOptions {
  [key: string]: [number, string];
}

interface ExtMap {
  RANDOMIZE_OPTIONS?: string;
  QUESTION_TYPE: string;
  STICKY_FUNC?: string;
  DESCRIPTION?: string;
  UNIC_NAME: string;
  REQUIRED: string;
  MULTI_SELECT?: string;
  OPTIONS?: IOptions;
  OPTIONS_SIZE?: number;
  SPECTRAL_START?: string;
  SPECTRAL_TYPE?: string;
  SELECTION_TYPE?: string;
  STEP?: string;
  SPECTRAL_END?: string;
  FORMULA?: string;
}

export interface IFieldDataItem {
  value: string;
  caption: string;
  elementStr: string;
  extMap: ExtMap;
}

export interface IFieldQuestionData {
  dataList: IFieldDataItem[];
  totalCount?: number;
  page?: number;
  rows?: number;
}

export interface CalculatorResult {
  formula: string;
  frontCalcData: string;
}
