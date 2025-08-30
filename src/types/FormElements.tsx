'use client';

import { IFormElementConstructor, IFormOptionList, tempObj } from './bulider';
import { SpectralFormElement } from '@/components/Fields/SpectralField';
import { TextFieldFormElement } from '@/components/Fields/TextField';
import { TitleFieldFinishFormElement } from '@/components/Fields/TitleFieldFinish';
import { TitleFieldStartFormElement } from '@/components/Fields/TitleFieldStart';
import { MultipleChoiceFormElement } from '@/components/Fields/MultipleChoiceField';
import { MultipleChoiceImageFormElement } from '@/components/Fields/MultipleChoiceImageField';
import { InfoFieldFormElement } from '@/components/Fields/InfoField';

export type ElementsType = 'TEXT_FIELD' | 'MULTIPLE_CHOICE' | 'TitleFieldStart' | 'TitleFieldFinish' | 'MULTIPLE_CHOICE_IMAGE' | 'SPECTRAL' | 'INFO_FIELD';

export type SubmitFunction = (key: number, value: string) => void;

export type FormElement = {
  questionType: ElementsType;

  construct: ({ questionId, questionGroupId, formId, title, position }: IFormElementConstructor) => FormElementInstance;

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

export type FormElementInstance = {
  questionId: number;
  questionGroupId?: number | null;
  formId?: number;
  title?: string;
  questionType?: ElementsType;
  position?: number | null;
  questionPropertyList?: Record<string, any>;
  optionList?: IFormOptionList[] | [] | null | undefined;
  temp?: boolean | tempObj;
  draft?: draftObj;
  startPageMsg?: string;
  description?: string;
  spectralPlaceList?: IFormOptionList[] | [] | null | undefined;
};

type draftObj = {
  prevGroup: number;
  position: number;
};

type FormElementsType = {
  [key in ElementsType]: FormElement;
};

export const FormElements: FormElementsType = {
  TEXT_FIELD: TextFieldFormElement,
  MULTIPLE_CHOICE: MultipleChoiceFormElement,
  SPECTRAL: SpectralFormElement,
  TitleFieldStart: TitleFieldStartFormElement,
  TitleFieldFinish: TitleFieldFinishFormElement,
  MULTIPLE_CHOICE_IMAGE: MultipleChoiceImageFormElement,
  INFO_FIELD: InfoFieldFormElement,
};
