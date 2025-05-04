import { Dispatch, SetStateAction } from "react";


export interface ICalculator {
  id: number;
  name: string;
  formBuilderId: number;
  theFormula: string;
  frontCalcData: string;
}

export interface ICalculatorCardProps {
  calculator: ICalculator;
  index:number;
  disabled?:boolean
}

export interface ICalculatorListProps {
  calculators: ICalculator[];
}

export interface ICalculatorModalProps {
  calculator: ICalculator | null;
}

export interface ICreateCalculatorDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IEditCalculatorDialogProps extends ICreateCalculatorDialogProps  {
  calcId : number
}



export interface IFrontCalcData {
  type: string;
  content: string;
  id?: string;
}

export interface ICalculatorFindDataResponse {
  id: number;
  name: string;
  formBuilderId: number;
  theFormula: string;
  frontCalcData: IFrontCalcData | string;
}



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
  totalCount: number;
  page: number;
  rows: number;
}


export interface IAdvancedFormulaEditorProps {
  questionList: IFieldQuestionData;
  handleClose: () => void;
  editList?: ICalculatorFindDataResponse;
  isEdit?: boolean;
}
