"use client";

import { notFound, useParams, useSearchParams } from "next/navigation";
import { createContext, Dispatch, ReactNode, useEffect, useReducer, } from "react";
import { FormElementInstance } from "@/types/FormElements";
import { toast } from "react-hot-toast";
import { IEndPageList } from "@/types/bulider";
import { AxiosApi } from "@/services/axios/AxiosApi";

type IInitialState = {
  questions: any[] | never[];
  status: string;
  title: string;
  index: number;
  answer: string | null;
  numQuestions: number | null;
  dispatch: Dispatch<any>;
};

type formResDataTypes = {
  name: string;
  description: string;
  typeValue: string;
  startPageMsg: string | null;
  endPageList: IEndPageList[];
  questionGroups: {
    formId: number;
    questionGroupId: number;
    questions: FormElementInstance[];
  }[];
};

const PreviewContext = createContext<IInitialState | null>(null);
export default PreviewContext;

const initialState: IInitialState = {
  questions: [],
  title: "",
  // 'loading', 'error', 'ready', "notExist"
  status: "loading",
  index: 0,
  answer: null,
  numQuestions: null,
  dispatch: () => { },
};

function reducer(state: IInitialState, action: any) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload.questions,
        title: action.payload.title,
        index:
          action.payload.index !== null &&
            action.payload.index <= action.payload.questions.length &&
            action.payload.index >= 0
            ? Number(action.payload.index)
            : 0,
        status: "ready",
      };
    case "dataFailed":
      notFound();
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "pervQuestion":
      return { ...state, index: state.index - 1, answer: null };
    case "noQuestionExist":
      return { ...state, status: "notExist" };
    default:
      throw new Error("Action unkonwn");
  }
}

export function PreviewProvider({ children }: { children: ReactNode }) {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [{ questions, status, index, answer, title }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const numQuestions: number = questions.length;
  const currentIndex = searchParams?.get("question");
    const search = searchParams.get('rep')
    const admin = search === "list"


  useEffect(() => {
    async function fetchData() {
      try {
        const { data }: { data: formResDataTypes } = await AxiosApi.get(
          admin ? `/admin/user/form/${id}` : `/user/form/${id}`
        );

        const allQuestions = data?.questionGroups
          ?.map((group: any) => group?.questions)
          .flat();

        if (!allQuestions.length) {
          dispatch({
            type: "noQuestionExist",
          });
        } else {
          dispatch({
            type: "dataReceived",
            payload: {
              questions: allQuestions as FormElementInstance[],
              index: currentIndex,
              title: data.name,
            },
          });
        }
      } catch (error) {
        dispatch({ type: "dataFailed" });
        toast.error("خطا در دریافت اطلاعات");
      }
    }

    fetchData();
  }, []);

  return (
    <PreviewContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        numQuestions,
        title,

        dispatch,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
}
