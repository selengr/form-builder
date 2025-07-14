import { IConditionQuestionType } from "@/types/conditionReportSolo";

export interface IDropdownItem {
  id: string;
  value: string;
  unique_name : string;
  placeholder: string;
}

export interface IInitialData {
    content: string
    contentWithIds: string
    dropdowns: Array<{
      id: string
      value: string
      unique_name: string
      position: number
    }>
  }
  
  export interface IAdvancedTextareaEditorProps {
    label : string;
    hasError? : boolean;
    qacWithOutFilter : any
    initialData?: IInitialData;
    onDataChange?: (data: any) => void
    validationErrors?: string[]
  }
  