import { createContext, Dispatch, SetStateAction } from "react";
import {
  ActionDesignerContextType,
  DesignerContextType,
  selectedElementObject,
} from "./DesignerContext";
import { FormElementInstance } from "../types/FormElements";

/* ---------------------------- Designer Context: Value & Action ---------------------------- */
export const DesignerContext = createContext<DesignerContextType | null>(null);
export const ActionDesignerContext =
  createContext<ActionDesignerContextType | null>(null);

/* ---------------------------- Elements Context: Value & Action ---------------------------- */
export const ActionElementsContext = createContext<Dispatch<
  SetStateAction<FormElementInstance[]>
> | null>(null);
export const ElementsContext = createContext<FormElementInstance[] | null>(
  null
);

/* --------------------------- Open Dialog Context: Value & Action -------------------------- */
export const ActionOpenDialogContext = createContext<Dispatch<
  SetStateAction<boolean>
> | null>(null);
export const OpenDialogContext = createContext<null | boolean>(null);

/* ------------------------ Selected Element Context: Value & Action ------------------------ */
export const ActionSelectedElementContext = createContext<Dispatch<
  SetStateAction<selectedElementObject | null>
> | null>(null);
export const SelectedElementContext =
  createContext<null | selectedElementObject>(null);

/* ----------------------- Question Is Loading Context: Value & Action ---------------------- */
export const ActionQuestionLoadingContext = createContext<Dispatch<
  SetStateAction<boolean>
> | null>(null);
export const QuestionLoadingContext = createContext<null | boolean>(null);

/* ------------------------ Open BottomSheet Context: Value & Action ------------------------ */
export const ActionOpenBottomSheetContext = createContext<Dispatch<
  SetStateAction<boolean>
> | null>(null);
export const OpenBottomSheetContext = createContext<null | boolean>(null);
