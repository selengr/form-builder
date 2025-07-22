"use client";
import {ComponentType, useState} from "react";
import {FormElementInstance} from "@/types/FormElements";

type WrappedComponentProps = {
  elementInstance: FormElementInstance;
  value: any;
  onChange: (newValue: any) => void;
  error: string;
};

const withValidation = <Div extends WrappedComponentProps>(
  WrappedComponent: ComponentType<Div | any>
) => {
  // eslint-disable-next-line react/display-name
  return (props: {
    elementInstance: FormElementInstance;
    onValidationUpdate: (isValid: boolean, value: any) => void;
    formData: string;
  }) => {
    const { elementInstance, onValidationUpdate } = props;
    const [error, setError] = useState<string>("");

    const minLength = elementInstance?.questionPropertyList?.find(
      (prop: any) => prop.questionPropertyEnum === "MINIMUM_LEN"
    )?.value;
    const maxLength = elementInstance?.questionPropertyList?.find(
      (prop: any) => prop.questionPropertyEnum === "MAXIMUM_LEN"
    )?.value;
    const requiredField =
      elementInstance?.questionPropertyList?.find(
        (prop: any) => prop.questionPropertyEnum === "REQUIRED"
      )?.value === "true";

    const validationRules = {
      required: requiredField,
      minLength: minLength ? Number(minLength) : null,
      maxLength: maxLength ? Number(maxLength) : null,
    };

    const validate = (newValue: any) => {
      let isValid = true;
      let errorMessage = "";
      let val = newValue;

      if (elementInstance.questionType === "TEXT_FIELD") {
        const fieldPattern = elementInstance?.questionPropertyList?.find(
          (el: any) => el.questionPropertyEnum === "TEXT_FIELD_PATTERN"
        )?.value;
        if (fieldPattern === "SHORT_TEXT" || fieldPattern === "LONG_TEXT") {
          val = newValue.trimStart();
        }
      }

      if (validationRules.required && (!val || val.length === 0)) {
        isValid = false;
        errorMessage = "الزامی است";
      }

      if (
        validationRules.minLength &&
        val?.length < validationRules.minLength
      ) {
        isValid = false;
        errorMessage = `حداقل باید ${validationRules.minLength} کاراکتر باشد`;
      }

      if (
        validationRules.maxLength &&
        val?.length > validationRules.maxLength
      ) {
        isValid = false;
        errorMessage = `حداکثر باید ${validationRules.maxLength} کاراکتر باشد`;
      }

      setError(errorMessage);
      onValidationUpdate(isValid, val);
    };

    const handleChange = (newValue: any) => {
      validate(newValue);
    };

    return (
      <WrappedComponent
        elementInstance={elementInstance}
        value={props.formData}
        onChange={handleChange}
        error={error}
      />
    );
  };
};

export default withValidation;
