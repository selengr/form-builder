import { ComponentType, useState } from "react";
import { FormElementInstance } from "@/types/FormElements";

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

    const validationRules = {
      // ^ Fix
      required: elementInstance?.questionPropertyList?.some(
        (prop: any) => prop.questionPropertyEnum === "REQUIRED"
      ),
      minLength: elementInstance?.questionPropertyList?.find(
        (prop: any) => prop.questionPropertyEnum === "MINIMUM_LEN"
      )?.value,
      maxLength: elementInstance?.questionPropertyList?.find(
        (prop: any) => prop.questionPropertyEnum === "MAXIMUM_LEN"
      )?.value,
    };

    const validate = (newValue: any) => {
      let isValid = true;
      let errorMessage = "";

      // ^ Fix me later: array type
      const val = newValue.trimStart();

      if (validationRules.required && !val) {
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
