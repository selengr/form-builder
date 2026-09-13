'use client';

import { RatingFormElement } from '@/components/Fields/RatingField';
import { TextFieldFormElement } from '@/components/Fields/TextField';
import { InfoFieldFormElement } from '@/components/Fields/InfoField';
import { SpectralFormElement } from '@/components/Fields/SpectralField';
import { TitleFieldStartFormElement } from '@/components/Fields/TitleFieldStart';
import { TitleFieldFinishFormElement } from '@/components/Fields/TitleFieldFinish';
import { MultipleChoiceFormElement } from '@/components/Fields/MultipleChoiceField';
import { PackageInjectionFormElement } from '@/components/Fields/PackageInjectionField';
import { MultipleChoiceImageFormElement } from '@/components/Fields/MultipleChoiceImageField';
import type { ElementsType, FormElement } from './formElementTypes';

export type {
  ElementsType,
  SubmitFunction,
  FormElement,
  FormElementInstance,
} from './formElementTypes';

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
