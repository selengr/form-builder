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
  }
  
  export interface ICalculatorListProps {
    calculators: ICalculator[];
  }
  
  export interface ICalculatorModalProps {
    calculator: ICalculator | null;
  }
  
  export interface ICreateCalculatorDialogProps {
    open: boolean;
    isEdit?: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
  }
