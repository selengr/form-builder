




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