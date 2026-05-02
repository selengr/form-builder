'use client';

import { IFormElementConstructor, IFormOptionList, tempObj } from './bulider';
import { RatingFormElement } from '@/components/Fields/RatingField';
import { TextFieldFormElement } from '@/components/Fields/TextField';
import { InfoFieldFormElement } from '@/components/Fields/InfoField';
import { SpectralFormElement } from '@/components/Fields/SpectralField';
import { TitleFieldStartFormElement } from '@/components/Fields/TitleFieldStart';
import { TitleFieldFinishFormElement } from '@/components/Fields/TitleFieldFinish';
import { MultipleChoiceFormElement } from '@/components/Fields/MultipleChoiceField';
import { PackageInjectionFormElement } from '@/components/Fields/PackageInjectionField';
import { MultipleChoiceImageFormElement } from '@/components/Fields/MultipleChoiceImageField';

export type ElementsType = 'TEXT_FIELD' | 'MULTIPLE_CHOICE' | 'TitleFieldStart' | 'TitleFieldFinish' | 'MULTIPLE_CHOICE_IMAGE' | 'SPECTRAL' | 'INFO_FIELD' | 'RATING' | 'PACKAGE_INJECTION_FIELD';

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
  title?: string;
  label?: string;
  formId?: number;
  draft?: draftObj;
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

type draftObj = {
  position: number;
  prevGroup: number;
};

type FormElementsType = {
  [key in ElementsType]: FormElement;
};

export const FormElements: FormElementsType = {
  RATING: RatingFormElement,
  SPECTRAL: SpectralFormElement,
  TEXT_FIELD: TextFieldFormElement,
  INFO_FIELD: InfoFieldFormElement,
  MULTIPLE_CHOICE: MultipleChoiceFormElement,
  TitleFieldStart: TitleFieldStartFormElement,
  TitleFieldFinish: TitleFieldFinishFormElement,
  MULTIPLE_CHOICE_IMAGE: MultipleChoiceImageFormElement,
  PACKAGE_INJECTION_FIELD: PackageInjectionFormElement,
};
