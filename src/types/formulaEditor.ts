export interface Element {
    type: "OPERATOR" | "NUMBER" | "NEW_FIELD" | "PARENTHESIS" | "AVG_PARENTHESIS" | "NEW_FnFx";
    content: string;
    id?: string;
  }
  
  export interface FnFxItem {
    fnValue: string;
    fnCaption: string;
  }
  
  