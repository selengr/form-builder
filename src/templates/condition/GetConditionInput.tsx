




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
