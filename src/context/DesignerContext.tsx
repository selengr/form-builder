/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { FormElementInstance } from "../types/FormElements";
import {
  ActionElementsContext,
  ActionOpenBottomSheetContext,
  ActionOpenDialogContext,
  ActionQuestionLoadingContext,
  ActionSelectedElementContext,
  DesignerContext,
  ElementsContext,
  OpenBottomSheetContext,
  OpenDialogContext,
  QuestionLoadingContext,
  SelectedElementContext,
  ActionDesignerContext,
} from "./AllContexts";

/* ---------------------------------- Types --------------------------------- */
export type selectedElementObject = {
  fieldElement: FormElementInstance | null | undefined;
  position: {
    apiPosition: number;
    realPosition: number;
  } | null;
};

export type ActionDesignerContextType = {
  addFinishPage: (element: FormElementInstance) => void;
  addStartPage: (element: FormElementInstance) => void;

  updateFinishPage: (element: FormElementInstance) => void;
  updateStartPage: (element: FormElementInstance) => void;

  removeFinishPage: () => void;
  removeStartPage: () => void;

  setQuestionGroups: (value: SetStateAction<number[]>) => void;

  updateElement: (id: number, element: FormElementInstance) => void;
  addElement: (index: number, element: FormElementInstance) => void;
  removeElement: (id: number) => void;

  createNewQuestionGroup(id: number): void;
  deleteQuestionGroup(id: any): void;

  setSelectedGroup: Dispatch<SetStateAction<number | null>>;
  setFormName: Dispatch<SetStateAction<string>>;
};

export type DesignerContextType = {
  startPage: FormElementInstance | null;
  finishPage: FormElementInstance | null;
  questionGroups: number[];
  selectedGroup: null | number;
  formName: string;
};

export default function DesignerContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [elements, setElements] = useState<FormElementInstance[]>([]);
  const [questionGroups, setQuestionGroups] = useState<number[]>([]);
  const [finishPage, setFinishPage] = useState<FormElementInstance | null>(
    null
  );
  const [startPage, setStartPage] = useState<FormElementInstance | null>(null);
  const [selectedElement, setSelectedElement] =
    useState<selectedElementObject | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openBottomSheet, setOpenBottomSheet] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<null | number>(null);
  const [questionLoading, setQuestionLoading] = useState<boolean>(false);
  const [formName, setFormName] = useState<string>("");

  const addFinishPage = useCallback((element: FormElementInstance) => {
    setFinishPage(element);
  }, []);

  const addStartPage = useCallback((element: FormElementInstance) => {
    setStartPage(element);
  }, []);

  const addElement = useCallback(
    (index: number, element: FormElementInstance) => {
      setElements((prev) => {
        const newElements = [...prev];
        newElements.splice(index, 0, element);
        return newElements;
      });
    },
    []
  );

  const removeStartPage = useCallback(() => {
    setStartPage(null);
  }, []);

  const removeElement = useCallback((id: number) => {
    setElements((prev) => prev.filter((element) => element?.questionId !== id));
  }, []);

  const removeFinishPage = useCallback(() => {
    setFinishPage(null);
  }, []);

  const updateStartPage = useCallback((element: FormElementInstance) => {
    setStartPage((prevPage: any) => ({
      ...prevPage,
      ...element,
    }));
  }, []);

  const updateFinishPage = useCallback((element: FormElementInstance) => {
    setFinishPage((prevPage: any) => ({
      ...prevPage,
      ...element,
    }));
  }, []);

  const updateElement = useCallback(
    (id: number, element: FormElementInstance) => {
      setElements((prev) => {
        const newElements = [...prev];
        const index = newElements.findIndex((el) => el?.questionId === id);
        newElements[index] = element;
        return newElements;
      });
    },
    []
  );

  const createNewQuestionGroup = useCallback((id: number) => {
    setQuestionGroups((questionGroups) => [...questionGroups, id]);
  }, []);

  const deleteQuestionGroup = useCallback((id: any) => {
    setElements((prev) => prev?.filter((t) => t?.questionGroupId !== id));
    // const filteredGroups = questionGroups?.filter((group) => group !== id);
    setQuestionGroups((prev) => prev.filter((group) => group !== id));
  }, []);

  const memoizedValues = useMemo(
    () => ({
      questionGroups,
      startPage,
      finishPage,
      selectedGroup,
      formName,
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questionGroups, startPage, finishPage, selectedGroup, formName]
  );

  const memoizedFuncs = useMemo(
    () => ({
      setFormName,
      setSelectedGroup,
      setQuestionGroups,

      addElement,
      removeElement,
      updateElement,

      addStartPage,
      removeStartPage,
      updateStartPage,

      addFinishPage,
      removeFinishPage,
      updateFinishPage,

      createNewQuestionGroup,
      deleteQuestionGroup,
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <ActionElementsContext.Provider value={setElements}>
      <ActionOpenDialogContext.Provider value={setOpenDialog}>
        <ActionSelectedElementContext.Provider value={setSelectedElement}>
          <ActionQuestionLoadingContext.Provider value={setQuestionLoading}>
            <ActionOpenBottomSheetContext.Provider value={setOpenBottomSheet}>
              <ActionDesignerContext.Provider value={memoizedFuncs}>
                <ElementsContext.Provider value={elements}>
                  <OpenDialogContext.Provider value={openDialog}>
                    <SelectedElementContext.Provider value={selectedElement}>
                      <QuestionLoadingContext.Provider value={questionLoading}>
                        <OpenBottomSheetContext.Provider
                          value={openBottomSheet}
                        >
                          <DesignerContext.Provider value={memoizedValues}>
                            {children}
                          </DesignerContext.Provider>
                        </OpenBottomSheetContext.Provider>
                      </QuestionLoadingContext.Provider>
                    </SelectedElementContext.Provider>
                  </OpenDialogContext.Provider>
                </ElementsContext.Provider>
              </ActionDesignerContext.Provider>
            </ActionOpenBottomSheetContext.Provider>
          </ActionQuestionLoadingContext.Provider>
        </ActionSelectedElementContext.Provider>
      </ActionOpenDialogContext.Provider>
    </ActionElementsContext.Provider>
  );
}
