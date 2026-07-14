'use client';

import { toast } from 'react-hot-toast';
import { useParams, useSearchParams } from 'next/navigation';
import { createContext, Dispatch, ReactNode, useEffect, useReducer } from 'react';
import { getPreviewFormData } from '../../actions/preview/getPreviewFormAction';

type IInitialState = {
  questions: any[] | never[];
  status: string;
  title: string;
  index: number;
  answer: string | null;
  numQuestions: number | null;
  errorMessage: string;
  dispatch: Dispatch<any>;
};

const PreviewContext = createContext<IInitialState | null>(null);
export default PreviewContext;

const initialState: Omit<IInitialState, 'dispatch'> = {
  questions: [],
  title: '',
  status: 'loading',
  index: 0,
  answer: null,
  numQuestions: null,
  errorMessage: '',
};

function reducer(state: Omit<IInitialState, 'dispatch'>, action: any) {
  switch (action.type) {
    case 'dataReceived':
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
        status: 'ready',
        errorMessage: '',
      };
    case 'dataFailed':
      return {
        ...state,
        status: 'error',
        errorMessage: action.payload?.error || 'انجام عملیات با خطا مواجه شد',
      };
    case 'nextQuestion':
      return { ...state, index: state.index + 1, answer: null };
    case 'pervQuestion':
      return { ...state, index: state.index - 1, answer: null };
    case 'noQuestionExist':
      return { ...state, status: 'notExist' };
    default:
      throw new Error('Action unkonwn');
  }
}

export function PreviewProvider({ children }: { children: ReactNode }) {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [{ questions, status, index, answer, title, errorMessage }, dispatch] = useReducer(
    reducer,
    initialState,
  );
  const numQuestions: number = questions.length;
  const currentIndex = searchParams?.get('question');
  const search = searchParams.get('rep');
  const admin = search === 'list';

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getPreviewFormData(id, admin);

        if (!result.success) {
          if (result.type === 'noQuestionExist') {
            dispatch({ type: 'noQuestionExist' });
          } else {
            dispatch({
              type: 'dataFailed',
              payload: { error: result.error },
            });
            toast.error(result.error || 'خطا در دریافت اطلاعات');
          }
        } else {
          dispatch({
            type: 'dataReceived',
            payload: {
              questions: result?.data?.questions,
              index: currentIndex,
              title: result.data?.title,
            },
          });
        }
      } catch (error: any) {
        dispatch({
          type: 'dataFailed',
          payload: { error: error?.message || 'انجام عملیات با خطا مواجه شد' },
        });
        toast.error(error?.message || 'انجام عملیات با خطا مواجه شد');
      }
    }

    fetchData();
  }, [admin, currentIndex, id]);

  return (
    <PreviewContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        numQuestions,
        title,
        errorMessage,
        dispatch,
      }}>
      {children}
    </PreviewContext.Provider>
  );
}
