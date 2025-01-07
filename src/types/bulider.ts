import { FormElementInstance } from "./FormElements";

export type IFormElementConstructor = {
  questionId: number;
  questionGroupId?: number | null;
  formId?: number;
  title?: string;
  position?: number | null;
  temp?: boolean | tempObj;
  optionList?: IFormOptionList;
  startPageMsg?: string;
  description?: string;
  endPageId?: number;
};

export type IEndPageList = {
  endPageId: number;
  formId: number;
  description: string;
};

export type tempObj = {
  prevPosition: number;
  prevQuestionGroupId: number;
};

export type IFormOptionList = {
  score: number;
  position?: number;
  isTarget?: boolean;
  title: string;
  link?: string;
  id?: number | null;
};

export type ITextFieldFormPatternOptions = {
  value: string;
  label: string;
}[];

export type IQPLTextField = [
  {
    id: number;
    questionPropertyEnum: "TEXT_FIELD_PATTERN";
    value: string;
  },
  {
    id: number;
    questionPropertyEnum: "REQUIRED";
    value: string;
  },
  {
    id: number;
    questionPropertyEnum: "DESCRIPTION";
    value: string | null;
  },
  {
    id: number;
    questionPropertyEnum: "MINIMUM_LEN";
    value: string | number | null;
  },
  {
    id: number;
    questionPropertyEnum: "MAXIMUM_LEN";
    value: string | number | null;
  },
  {
    id: number;
    questionPropertyEnum: "EDIT_ANSWER_LOCKED";
    value: string;
  }
];

export type ISpectralQTapAndOptionsType = { value: string; label: string }[];

export type IQPLSpectral = [
  {
    questionPropertyEnum: "SPECTRAL_TYPE";
    value: string;
    id: number;
  },
  {
    questionPropertyEnum: "REQUIRED";
    value: string;
    id: number;
  },
  {
    questionPropertyEnum: "DESCRIPTION";
    value: string | null;
    id: number;
  },
  {
    questionPropertyEnum: "SELECTION_TYPE";
    value: string;
    id: number;
  },
  {
    questionPropertyEnum: "STEP";
    value: number | string;
    id: number;
  },
  {
    questionPropertyEnum: "SPECTRAL_START";
    value: number | string;
    id: number;
  },
  {
    questionPropertyEnum: "SPECTRAL_END";
    value: number | string;
    id: number;
  }
];

export type IQPLMultipleChoice = [
  {
    id: number;
    questionPropertyEnum: "MULTI_SELECT";
    value: string;
  },
  {
    id: number;
    questionPropertyEnum: "REQUIRED";
    value: string;
  },
  {
    id: number;
    questionPropertyEnum: "RANDOMIZE_OPTIONS";
    value: string;
  },
  {
    id: number;
    questionPropertyEnum: "DESCRIPTION";
    value: string | null;
  }
];

export type ITest = {
  name: string;
};

export type IChangeOrMovePositionApi = {
  formBuilderId: number;
  questionId: number;
  questionGroupId: number;
  targetQuestionGroupId: number | null;
  newPosition: number;
};

export type formResDataTypes = {
  name: string;
  typeEnum: string;
  startPageMsg: string | null;
  endPageList: IEndPageList[];
  questionGroups: {
    formId: number;
    questionGroupId: number;
    questions: FormElementInstance[];
  }[];
};
