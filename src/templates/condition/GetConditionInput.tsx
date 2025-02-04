import { SelectController, MultiSelectController } from "../components/SelectController"
import { TextFieldController } from "../components/TextFieldController"

import { Box } from "@mui/material";
import { Controller} from "react-hook-form";
import { DatePicker as DatePickerCustome } from "../components/DatePicker";






export const getQuestion = (type: string, values: any) => {
    console.log(type);
    switch (type?.split("*")[0]) {
      case "MULTIPLE_CHOICE":
        return [
          { value: "VALUE", label: "ارزش" },
          { value: "OPTION", label: "گزینه" },
          { value: "QUESTION", label: "سوال " },
          { value: "CALCULATION", label: "محاسبه‌گر" },
        ];

      case "MULTIPLE_CHOICE_MULTI_SELECT":
        return [{ value: "OPTION", label: "گزینه" }];

      case "TEXT_FIELD":
        return [
          { value: "VALUE", label: "ارزش" },
          { value: "TEXT", label: "متن" },
        ];

      case "SPECTRAL":
        return [
          { value: "VALUE", label: "ارزش" },
          { value: "QUESTION", label: "سوال " },
          { value: "CALCULATION", label: "محاسبه‌گر" },
        ];

      case "SPECTRAL_DOMAIN":
        return [{ value: "VALUE", label: "ارزش" }];

      case "TEXT_FIELD_DATE":
        return [
          { value: "QUESTION", label: "سوال" },
          { value: "DATE", label: "تاریخ" },
        ];

      case "TEXT_FIELD_NUMBER":
        return [
          { value: "VALUE", label: "ارزش" },
          { value: "QUESTION", label: "سوال " },
          { value: "CALCULATION", label: "محاسبه‌گر" },
        ];

      
      case "CALCULATION":
        return [
          { value: "VALUE", label: "ارزش" },
          { value: "QUESTION", label: "سوال " },
          { value: "CALCULATION", label: "محاسبه‌گر" },
        ];

      default:
        return [];
    }
  };

  export const getCondition = (type: string, operator: string, values: any) => {
    const combinedKey = `${type?.split("*")[0]}_${operator}`;
    switch (combinedKey) {
      case "MULTIPLE_CHOICE_VALUE":
      case "MULTIPLE_CHOICE_OPTION":
      case "MULTIPLE_CHOICE_QUESTION":
      case "MULTIPLE_CHOICE_CALCULATION":
        return [
          { value: "#equalMultiChoiceSingle", label: "برابر با" },
          { value: "!#equalMultiChoiceSingle", label: "نابرابر با" },
          { value: "!#lessThanMultiChoiceSingle", label: "بزرگتر از" },
          { value: "#lessThanMultiChoiceSingle", label: "کوچکتر از" },
        ];

      case "MULTIPLE_CHOICE_MULTI_SELECT_OPTION":
        return [
          { value: "#containMultiChoiceMulti", label: "شامل شدن" },
          { value: "!#containMultiChoiceMulti", label: "شامل نشدن" },
          { value: "#equalThanMultiChoiceMulti", label: "برابر با" },
          { value: "!#equalThanMultiChoiceMulti", label: "نابرابر با" },
        ];

      case "TEXT_FIELD_TEXT":
        return [
          { value: "#startWithText", label: "شروع شدن با " },
          { value: "#endWithText", label: "پایان یافتن با" },
          { value: "#containAnyText", label: "شامل شدن" },
          { value: "!#containAnyText", label: "شامل نشدن" },
        ];

      case "TEXT_FIELD_VALUE":
        return [
          { value: "#lenEqualText", label: "طول متن برابر با" },
          { value: "#lenGraterThanText", label: "طول متن بیشتر از" },
          { value: "!#lenGraterThanText", label: "طول متن کمتر از" },
        ];

      case "SPECTRAL_VALUE":
      case "SPECTRAL_QUESTION":
      case "SPECTRAL_CALCULATION":
        return [
          { value: "#greaterThanSpectral", label: "بزرگتر از" },
          { value: "#greaterThanSpectral", label: "کوچکتر  از" },
          { value: "#equalThanSpectralSingle", label: "برابر  با" },
          { value: "#greaterEqualThanSpectralSingle", label: "بزرگتر مساوی" },
          { value: "!#greaterEqualThanSpectralSingle", label: " کوچکتر مساوی" },
        ];

      case "SPECTRAL_DOMAIN_VALUE":
        return [
          { value: "#lessThanSpectralDouble", label: "کوچکتر  از" },
          { value: "#greaterThanSpectralDouble", label: "بزرگتر از" },
        ];

      case "TEXT_FIELD_DATE_DATE":
      case "TEXT_FIELD_DATE_QUESTION":
        return [
          { value: "#afterDate", label: "بعد از" },
          { value: "#beforeDate", label: "قبل از" },
        ];

      
      case "TEXT_FIELD_NUMBER_VALUE":
      case "TEXT_FIELD_NUMBER_QUESTION":
      case "TEXT_FIELD_NUMBER_CALCULATION":
        return [
          { value: "#greaterThanNumber", label: "بزرگتر از" },
          { value: "!#greaterThanNumber", label: "کوچکتر  از" },
          // { value: "#equalThanNumber", label: "برابر  با" },
          { value: "#greaterEqualThanNumber", label: "بزرگتر مساوی" },
          { value: "!#greaterEqualThanNumber", label: " کوچکتر مساوی" },
        ];

      
      case "CALCULATION_VALUE":
      case "CALCULATION_QUESTION":
      case "CALCULATION_CALCULATION":
        return [
          { value: "#greaterThanNumber", label: "بزرگتر از" },
          { value: "!#greaterThanNumber", label: "کوچکتر از" },
          { value: "#greaterEqualThanNumber", label: "بزرگتر مساوی" },
          { value: "!#greaterEqualThanNumber", label: " کوچکتر مساوی" },
          { value: "#equalThanNumber", label: "برابر  با" },
          { value: "!#equalThanNumber", label: "نابرابر با" },
        ];

      default:
        return [];
    }
  };




export const getInput = (
  type: string,
  operator: string,
  condition: string,
  field: { name: any; key?: string },
  {
    onlySomeQuestionsOptions,
    isFetchingOnlyAllQuestions,
    onlyAllCalculationOptions,
    isFetchingOnlyAllCalculation,
    onlyAllQuestions,
    control,
    setValue,
  },
) => {
  const combinedKey = `${type?.split("*")[0]}_${operator}_${condition}`

  switch (combinedKey) {
      
    case "MULTIPLE_CHOICE_VALUE_#equalMultiChoiceSingle":
    case "MULTIPLE_CHOICE_VALUE_!#equalMultiChoiceSingle":
    case "MULTIPLE_CHOICE_VALUE_#lessThanMultiChoiceSingle":
    case "MULTIPLE_CHOICE_VALUE_!#lessThanMultiChoiceSingle":
      return <TextFieldController name={field.name} type="number" />;

    
    case "MULTIPLE_CHOICE_QUESTION_#equalMultiChoiceSingle":
    case "MULTIPLE_CHOICE_QUESTION_!#equalMultiChoiceSingle":
    case "MULTIPLE_CHOICE_QUESTION_#lessThanMultiChoiceSingle":
    case "MULTIPLE_CHOICE_QUESTION_!#lessThanMultiChoiceSingle":
      return (
        <SelectController
          name={field.name}
          options={onlySomeQuestionsOptions}
          isLoading={isFetchingOnlyAllQuestions}
          sx={{ minWidth: 194 }}
        />
      );

    
    case "MULTIPLE_CHOICE_CALCULATION_#equalMultiChoiceSingle":
    case "MULTIPLE_CHOICE_CALCULATION_!#equalMultiChoiceSingle":
    case "MULTIPLE_CHOICE_CALCULATION_#lessThanMultiChoiceSingle":
    case "MULTIPLE_CHOICE_CALCULATION_!#lessThanMultiChoiceSingle":
      return (
        <SelectController
          name={field.name}
          options={onlyAllCalculationOptions}
          isLoading={isFetchingOnlyAllCalculation}
          sx={{ minWidth: 194 }}
        />
      );

    
    case "MULTIPLE_CHOICE_OPTION_#equalMultiChoiceSingle":
    case "MULTIPLE_CHOICE_OPTION_!#equalMultiChoiceSingle":
    case "MULTIPLE_CHOICE_OPTION_#lessThanMultiChoiceSingle":
    case "MULTIPLE_CHOICE_OPTION_!#lessThanMultiChoiceSingle": {
      const typeParts = type.split("*");
      if (typeParts.length < 2) return null;
      const targetUnicName = typeParts[1];

      const targetQuestion = onlyAllQuestions?.find(
        (item) => item?.extMap?.UNIC_NAME === targetUnicName
      );

      if (!targetQuestion) return null;

      const { OPTIONS: options = {} } = targetQuestion.extMap;
      const mappedOptions = Object.entries(options).map(([key, value]) => ({
        value: key,
        label: value[1],
      }));

      return (
        <SelectController
          key={targetUnicName}
          name={field.name}
          options={mappedOptions}
          sx={{ minWidth: 194 }}
        />
      );
    }
    
    case "MULTIPLE_CHOICE_MULTI_SELECT_OPTION_#containMultiChoiceMulti":
    case "MULTIPLE_CHOICE_MULTI_SELECT_OPTION_!#containMultiChoiceMulti":
    case "MULTIPLE_CHOICE_MULTI_SELECT_OPTION_!#equalThanMultiChoiceMulti":
    case "MULTIPLE_CHOICE_MULTI_SELECT_OPTION_#equalThanMultiChoiceMulti": {
      const typeParts = type.split("*");
      if (typeParts.length < 2) return null;
      const targetUnicName = typeParts[1];

      const targetQuestion = onlyAllQuestions?.find(
        (item) => item?.extMap?.UNIC_NAME === targetUnicName
      );

      if (!targetQuestion?.extMap?.OPTIONS) return null;
      const { OPTIONS } = targetQuestion.extMap;
      const options = Object.entries(OPTIONS).map(([value, data]) => ({
        value,
        label: data[1],
      }));

      return (
        <MultiSelectController
          key={targetUnicName}
          name={field.name}
          options={options}
          sx={{
            maxWidth: 194,
            maxHeight: 50,
          }}
          aria-label={`Multi-select ${targetUnicName}`}
          // chip
          // checkbox
        />
      );
    }

    
    case "TEXT_FIELD_TEXT_#startWithText":
    case "TEXT_FIELD_TEXT_#endWithText":
      return <TextFieldController name={field.name} type="string" />
    
    case "TEXT_FIELD_TEXT_#containAnyText":
    case "TEXT_FIELD_TEXT_!#containAnyText":
      return <TextFieldController name={field.name} type="string" />
    
    case "TEXT_FIELD_VALUE_#lenEqualText":
    case "TEXT_FIELD_VALUE_#lenGraterThanText":
    case "TEXT_FIELD_VALUE_!#lenGraterThanText":
      return <TextFieldController name={field.name} type="number" />

    case "SPECTRAL_VALUE_#greaterThanSpectral":
    case "SPECTRAL_VALUE_!#greaterThanSpectral":
    case "SPECTRAL_VALUE_#equalThanSpectralSingle":
    case "SPECTRAL_VALUE_#greaterEqualThanSpectralSingle":
    case "SPECTRAL_VALUE_!#greaterEqualThanSpectralSingle":
      return <TextFieldController name={field.name} type="number" />

    case "SPECTRAL_QUESTION_#greaterThanSpectral":
    case "SPECTRAL_QUESTION_!#greaterThanSpectral":
    case "SPECTRAL_QUESTION_#equalThanSpectralSingle":
    case "SPECTRAL_QUESTION_#greaterEqualThanSpectralSingle":
    case "SPECTRAL_QUESTION_!#greaterEqualThanSpectralSingle":
      return (
        <SelectController
          name={field.name}
          options={onlySomeQuestionsOptions}
          isLoading={isFetchingOnlyAllQuestions}
          sx={{ minWidth: 194 }}
        />
      );

    case "SPECTRAL_CALCULATION_#greaterThanSpectral":
    case "SPECTRAL_CALCULATION_!#greaterThanSpectral":
    case "SPECTRAL_CALCULATION_#equalThanSpectralSingle":
    case "SPECTRAL_CALCULATION_#greaterEqualThanSpectralSingle":
    case "SPECTRAL_CALCULATION_!#greaterEqualThanSpectralSingle":
      return (
        <SelectController
          name={field.name}
          options={onlyAllCalculationOptions}
          isLoading={isFetchingOnlyAllCalculation}
          sx={{ minWidth: 194 }}
        />
      );

    case "SPECTRAL_DOMAIN_VALUE_#lessThanSpectralDouble":
    case "SPECTRAL_DOMAIN_VALUE_#greaterThanSpectralDouble":
      return <TextFieldController name={field.name} type="number" />;

    case "TEXT_FIELD_DATE_DATE_#beforeDate":
    case "TEXT_FIELD_DATE_DATE_#afterDate":
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: { value }, fieldState: { error } }) => (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{
                "& .rmdp-wrapper.rmdp-border": {
                  borderRadius: "20px",
                },
              }}
            >
              <DatePickerCustome
                min={new Date().setDate(new Date().getDate() - 1)}
                value={value ? value : new Date()}
                onChange={(date) => {
                  setValue(field?.name, date);
                }}
              />
            </Box>
          )}
        />
      );
    // need to change the list
    case "TEXT_FIELD_DATE_QUESTION_#beforeDate":
    case "TEXT_FIELD_DATE_QUESTION_#afterDate":
      return (
        <SelectController
          name={field.name}
          options={onlySomeQuestionsOptions}
          isLoading={isFetchingOnlyAllQuestions}
          sx={{ minWidth: 194 }}
        />
      );

    
    case "TEXT_FIELD_NUMBER_VALUE_#greaterThanNumber":
    case "TEXT_FIELD_NUMBER_VALUE_!#greaterThanNumber":
    case "TEXT_FIELD_NUMBER_VALUE_#greaterEqualThanNumber":
    case "TEXT_FIELD_NUMBER_VALUE_!#greaterEqualThanNumber":
      return <TextFieldController name={field.name} type="number" />;

    
    case "TEXT_FIELD_NUMBER_QUESTION_#greaterThanNumber":
    case "TEXT_FIELD_NUMBER_QUESTION_!#greaterThanNumber":
    case "TEXT_FIELD_NUMBER_QUESTION_#greaterEqualThanNumber":
    case "TEXT_FIELD_NUMBER_QUESTION_!#greaterEqualThanNumber":
      return (
        <SelectController
          name={field.name}
          options={onlySomeQuestionsOptions}
          isLoading={isFetchingOnlyAllQuestions}
          sx={{ minWidth: 194 }}
        />
      );
    
    case "TEXT_FIELD_NUMBER_CALCULATION_#greaterThanNumber":
    case "TEXT_FIELD_NUMBER_CALCULATION_!#greaterThanNumber":
    case "TEXT_FIELD_NUMBER_CALCULATION_#greaterEqualThanNumber":
    case "TEXT_FIELD_NUMBER_CALCULATION_!#greaterEqualThanNumber":
      return (
        <SelectController
          name={field.name}
          options={onlyAllCalculationOptions}
          isLoading={isFetchingOnlyAllCalculation}
          sx={{ minWidth: 194 }}
        />
      );

    case "CALCULATION_VALUE_#equalThanNumber":
    case "CALCULATION_VALUE_!#equalThanNumber":
    case "CALCULATION_VALUE_#greaterThanNumber":
    case "CALCULATION_VALUE_!#greaterThanNumber":
    case "CALCULATION_VALUE_#greaterEqualThanNumber":
    case "CALCULATION_VALUE_!#greaterEqualThanNumber":
      return <TextFieldController name={field.name} type="number" />;

    case "CALCULATION_QUESTION_#equalThanNumber":
    case "CALCULATION_QUESTION_!#equalThanNumber":
    case "CALCULATION_QUESTION_#greaterThanNumber":
    case "CALCULATION_QUESTION_!#greaterThanNumber":
    case "CALCULATION_QUESTION_#greaterEqualThanNumber":
    case "CALCULATION_QUESTION_!#greaterEqualThanNumber":
      return (
        <SelectController
          name={field.name}
          options={onlySomeQuestionsOptions}
          isLoading={isFetchingOnlyAllQuestions}
          sx={{ minWidth: 194 }}
        />
      );

    case "CALCULATION_CALCULATION_#equalThanNumber":
    case "CALCULATION_CALCULATION_!#equalThanNumber":
    case "CALCULATION_CALCULATION_#greaterThanNumber":
    case "CALCULATION_CALCULATION_!#greaterThanNumber":
    case "CALCULATION_CALCULATION_#greaterEqualThanNumber":
    case "CALCULATION_CALCULATION_!#greaterEqualThanNumber":
      return (
        <SelectController
          name={field.name}
          options={onlyAllCalculationOptions}
          isLoading={isFetchingOnlyAllCalculation}
          sx={{ minWidth: 194 }}
        />
      );

    default:
      return <TextFieldController name={field.name} disabled />;
  }
}

