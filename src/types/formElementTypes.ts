import type { IFormElementConstructor, IFormOptionList, tempObj } from './bulider';

export type ElementsType =
  | 'TEXT_FIELD'
  | 'MULTIPLE_CHOICE'
  | 'TitleFieldStart'
  | 'TitleFieldFinish'
  | 'MULTIPLE_CHOICE_IMAGE'
  | 'SPECTRAL'
  | 'INFO_FIELD'
  | 'RATING'
  | 'PACKAGE_INJECTION_FIELD';

export type SubmitFunction = (key: number, value: string) => void;

export type FormElementInstance = {
  title?: string;
  label?: string;
  formId?: number;
  draft?: {
    position: number;
    prevGroup: number;
  };
  questionId: number;
  description?: string;
  startPageMsg?: string;
  position?: number | null;
  temp?: boolean | tempObj;
  questionType?: ElementsType;
  questionGroupId?: number | null;
  questionPropertyList?: Record<string, any>;
  optionList?: IFormOptionList[] | [] | null | undefined;
  spectralPlaceList?: IFormOptionList[] | [] | null | undefined;
};

export type FormElement = {
  questionType: ElementsType;

  construct: ({
    questionId,
    questionGroupId,
    formId,
    title,
    position,
  }: IFormElementConstructor) => FormElementInstance;

  designerBtnElement: {
    label: string;
    icon?: any;
  };

  designerComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;
  formComponent: React.FC<{
    elementInstance?: FormElementInstance;
    value?: string | string[] | any;
    onChange?: (value: any) => void;
    error?: string;
    isPreview?: boolean;
  }>;
  propertiesComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;

  validate: (formElement: FormElementInstance, currentValue: string) => boolean;
};
//todo: add type for form element instance