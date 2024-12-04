"use client";

import { Fragment, memo, useState } from "react";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "../../types/FormElements";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import FormProvider from "../../components/hook-form/FormProvider";
import {
  RHFMultiSelect,
  RHFSwitch,
  RHFTextField,
} from "../../components/hook-form";
import FieldDialogActionBottomButtons from "../FieldDialogActionBottomButtons/FieldDialogActionBottomButtons";
import {
  IFormElementConstructor,
  IQPLTextField,
  ITextFieldFormPatternOptions,
} from "../../types/bulider";
import AxiosApi from "@/services/axios/AxiosApi";
import useDesigner from "@/hooks/useDesigner";
import useElements from "@/hooks/useElements";
import useActionOpenDialog from "@/hooks/useActionOpenDialog";
import useActionSelectedElement from "@/hooks/useActionSelectedElement";
import useSelectedElement from "@/hooks/useSelectedElement";
import useActionDesigner from "@/hooks/useActionDesigner";
import { useResponsive } from "@/hooks/useResponsive";
import TextBlockIcon from "@/../public/images/home-page/text-block.svg";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import { SwitchButton } from "../Switch/SwitchButton";

const questionType: ElementsType = "TEXT_FIELD";

const questionPropertyList: IQPLTextField = [
  {
    questionPropertyEnum: "TEXT_FIELD_PATTERN",
    value: "SHORT_TEXT",
  },
  {
    questionPropertyEnum: "REQUIRED",
    value: "false",
  },
  {
    questionPropertyEnum: "DESCRIPTION",
    value: "",
  },
  {
    questionPropertyEnum: "MINIMUM_LEN",
    value: 1,
  },
  {
    questionPropertyEnum: "MAXIMUM_LEN",
    value: 250,
  },
];

const fieldPatternOptions: ITextFieldFormPatternOptions = [
  { value: "SHORT_TEXT", label: "متن ساده" },
  { value: "LONG_TEXT", label: "متن بلند" },
  { value: "NUMBER", label: "عددی" },
  { value: "NATIONAL_CODE", label: "کدملی" },
  { value: "DATE", label: "تاریخ" },
  { value: "PHONE", label: "تلفن" },
];

const propertiesSchema = z
  .object({
    title: z
      .string()
      .trim()
      .transform((value) => value.replace(/\s+/g, " "))
      .pipe(
        z
          .string()
          .min(1, { message: "حداقل باید 1 و حداکثر 100 کاراکتر باشد" })
          .max(100, { message: "حداقل باید 1 و حداکثر 100 کاراکتر باشد" })
      ),
    MINIMUM_LEN: z
      .number({ invalid_type_error: "اجباری است" })
      .min(1, { message: "حداقل باید 1 کاراکتر باشد" }),
    MAXIMUM_LEN: z
      .number({ invalid_type_error: "اجباری است" })
      .min(1, { message: "حداقل باید 1 کاراکتر باشد" }),
    DESCRIPTION: z
      .string()
      .trim()
      .transform((value) => value.replace(/\s+/g, " "))
      .pipe(z.string().max(250, { message: "حداکثر میتواند 250 کاراکتر باشد" }))
      .optional(),
    REQUIRED: z.boolean().default(false),
    TEXT_FIELD_PATTERN: z.string(),
  })
  .refine((val) => val.MAXIMUM_LEN >= val.MINIMUM_LEN, {
    message: "حداکثر باید از حداقل بیشتر باشد",
    path: ["MAXIMUM_LEN"],
  })
  .refine(
    (val) => {
      if (val.TEXT_FIELD_PATTERN === "LONG_TEXT") {
        return val.MAXIMUM_LEN <= 1000;
      }
      return true;
    },
    {
      message: "حداکثر طول برای متنی بلند باید 1000 کاراکتر باشد",
      path: ["MAXIMUM_LEN"],
    }
  )
  .refine(
    (val) => {
      if (val.TEXT_FIELD_PATTERN === "SHORT_TEXT") {
        return val.MAXIMUM_LEN <= 250;
      }
      return true;
    },
    {
      message: "حداکثر طول برای متنی ساده باید 250 کاراکتر باشد",
      path: ["MAXIMUM_LEN"],
    }
  );

const DesignerComponent = memo(function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const labelText = element.title;
  const designerBtnLabel = TextFieldFormElement.designerBtnElement.label;

  return (
    <div
      className="flex items-start flex-col overflow-hidden absolute"
      dir="rtl"
      style={{
        width: "calc(100% - 96px)",
      }}
    >
      <p
        dir="rtl"
        className="text-base overflow-hidden text-ellipsis w-full"
        style={{ textWrap: "nowrap", fontWeight: "700" }}
      >
        {labelText}
      </p>
      <p className="text-xs text-[#424242]">#{designerBtnLabel}</p>
    </div>
  );
});

export const TextFieldFormElement: FormElement = {
  questionType,
  construct: ({
    questionId,
    questionGroupId,
    formId,
    title,
    position,
  }: IFormElementConstructor) => ({
    questionId,
    questionGroupId,
    formId,
    title,
    questionType,
    position,
    questionPropertyList: questionPropertyList,
  }),
  designerBtnElement: {
    label: "متنی",
    icon: TextBlockIcon,
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: (
    formElement: FormElementInstance,
    currentValue: string
  ): boolean => {
    const element = formElement as CustomInstance;
    if (element.questionPropertyList.required) {
      return currentValue.length > 0;
    }

    return true;
  },
};

type CustomInstance = FormElementInstance & {
  questionPropertyList: typeof questionPropertyList;
};

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const isMobile = useResponsive("down", "sm");
  const [calendarValue, setCalendarValue] = useState(new Date());
  const fieldPattern = element.questionPropertyList.find(
    (el) => el.questionPropertyEnum === "TEXT_FIELD_PATTERN"
  )?.value;
  const description = element.questionPropertyList.find(
    (el) => el.questionPropertyEnum === "DESCRIPTION"
  )?.value;
  const min = element.questionPropertyList.find(
    (el) => el.questionPropertyEnum === "MINIMUM_LEN"
  )?.value;
  const max = element.questionPropertyList.find(
    (el) => el.questionPropertyEnum === "MAXIMUM_LEN"
  )?.value;

  let content;

  switch (fieldPattern) {
    case "LONG_TEXT":
      content = (
        <Fragment>
          <TextField
            rows={4}
            multiline
            type="text"
            sx={{
              "& .MuiInputBase-root": {
                padding: 1.5,
              },
              "& input": {
                padding: 0,
              },
            }}
            fullWidth
          />
        </Fragment>
      );
      break;
    case "SHORT_TEXT":
      content = (
        <Fragment>
          <TextField
            type="text"
            sx={{
              "& .MuiInputBase-root": {
                padding: 1.5,
              },
              "& input": {
                padding: 0,
              },
            }}
            fullWidth
          />
        </Fragment>
      );
      break;
    case "NUMBER":
      content = (
        <Fragment>
          <TextField
            type="number"
            sx={{
              "& .MuiInputBase-root": {
                padding: 1.5,
              },
              "& input": {
                padding: 0,
              },
            }}
            fullWidth
          />
        </Fragment>
      );
      break;
    case "NATIONAL_CODE":
      content = (
        <Fragment>
          <TextField
            placeholder="2981859878"
            type="tel"
            sx={{
              "& .MuiInputBase-root": {
                padding: 1.5,
              },
              "& input": {
                padding: 0,
              },
            }}
            inputProps={{
              maxLength: 10,
            }}
            fullWidth
          />
        </Fragment>
      );
      break;
    case "PHONE":
      content = (
        <Fragment>
          <TextField
            type="tel"
            placeholder="09358956545"
            inputProps={{
              maxLength: 11,
            }}
            sx={{
              "& .MuiInputBase-root": {
                padding: 1.5,
              },
              "& input": {
                padding: 0,
              },
            }}
            fullWidth
          />
        </Fragment>
      );
      break;
    case "DATE":
      content = (
        <Fragment>
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
            <DatePicker
              shadow={false}
              calendar={persian}
              locale={persian_fa}
              value={calendarValue}
              onChange={(e: any) => setCalendarValue(e)}
              className={isMobile ? "rmdp-mobile" : ""}
              zIndex={9999}
              inputClass="h-[50px] px-4 border-[1px] w-full border-neutral-300 rounded-xl text-left p-1"
              highlightToday
              portal
            />
          </Box>
        </Fragment>
      );
      break;
  }

  return (
    <Box
      display="flex"
      gap={1}
      flexDirection="column"
      width="100%"
      maxWidth="600px"
    >
      <Box display="flex" justifyContent="space-between" width="100%">
        <Typography sx={{ marginRight: "25px", fontWeight: "600" }}>
          {element.title}
        </Typography>
        {min && max ? (
          <Typography
            sx={{ direction: "rtl", textWrap: "nowrap", fontWeight: "600" }}
            variant="subtitle2"
          >
            {max + " / " + min}
          </Typography>
        ) : null}
      </Box>
      {content}
      {description && (
        <Typography
          sx={{ fontSize: "12px", fontWeight: "500" }}
          variant="subtitle2"
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const descriptionSwitchStatus: boolean = element.questionPropertyList.some(
    (property) => {
      if (property.questionPropertyEnum === "DESCRIPTION") {
        return property.value ? true : false;
      } else {
        return false;
      }
    }
  );
  const textFieldPatternVal = element.questionPropertyList.find(
    (prop) => prop.questionPropertyEnum === "TEXT_FIELD_PATTERN"
  )?.value;
  const isShortTextPatternSelected =
    textFieldPatternVal === "SHORT_TEXT" || textFieldPatternVal === "LONG_TEXT"
      ? true
      : false;
  const [showMinMaxProps, setShowMinMaxProps] = useState<boolean>(
    isShortTextPatternSelected
  );
  const [openDescriptionSwitch, setOpenDescriptionSwitch] = useState<boolean>(
    descriptionSwitchStatus
  );
  const elements = useElements();
  const setOpenDialog = useActionOpenDialog();
  const setSelectedElement = useActionSelectedElement();
  const selectedElement = useSelectedElement();
  const { updateElement, addElement } = useActionDesigner();
  const { questionGroups } = useDesigner();

  const defaultValues = element.questionPropertyList.reduce(
    (acc: any, attribute: any) => {
      if (attribute.questionPropertyEnum === "REQUIRED") {
        acc[attribute.questionPropertyEnum] =
          attribute.value === "true" ? true : false;
      } else if (attribute.questionPropertyEnum === "MINIMUM_LEN") {
        acc[attribute.questionPropertyEnum] =
          attribute.value === "" || attribute.value === null
            ? 1
            : Number(attribute.value);
      } else if (attribute.questionPropertyEnum === "MAXIMUM_LEN") {
        acc[attribute.questionPropertyEnum] =
          attribute.value === "" || attribute.value === null
            ? 250
            : Number(attribute.value);
      } else if (attribute.questionPropertyEnum === "DESCRIPTION") {
        acc[attribute.questionPropertyEnum] =
          attribute.value === null ? "" : attribute.value;
      } else {
        acc[attribute.questionPropertyEnum] = attribute.value;
      }
      return acc;
    },
    {}
  );
  defaultValues.title = element.title;

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onChange",
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { isSubmitting },
  } = methods;

  async function onSubmit(values: propertiesFormSchemaType) {
    const {
      title,
      DESCRIPTION,
      REQUIRED,
      TEXT_FIELD_PATTERN,
      MAXIMUM_LEN,
      MINIMUM_LEN,
    } = values;

    // finds whether a field is selected or not
    const selectedYet = elements?.find(
      (el: any) => el?.questionId === element?.questionId
    );

    const data = [
      {
        questionPropertyEnum: "TEXT_FIELD_PATTERN",
        value: TEXT_FIELD_PATTERN,
      },
      {
        questionPropertyEnum: "REQUIRED",
        value: REQUIRED ? "true" : "false",
      },
      {
        questionPropertyEnum: "DESCRIPTION",
        value: openDescriptionSwitch && DESCRIPTION ? DESCRIPTION : null,
      },
      {
        questionPropertyEnum: "MAXIMUM_LEN",
        value:
          TEXT_FIELD_PATTERN === "SHORT_TEXT" ||
          TEXT_FIELD_PATTERN === "LONG_TEXT"
            ? MAXIMUM_LEN
            : null,
      },
      {
        questionPropertyEnum: "MINIMUM_LEN",
        value:
          TEXT_FIELD_PATTERN === "SHORT_TEXT" ||
          TEXT_FIELD_PATTERN === "LONG_TEXT"
            ? MINIMUM_LEN
            : null,
      },
    ];

    const lastIndexOfGroup = elements.findLastIndex(
      (el: any) =>
        el.questionGroupId === selectedElement?.fieldElement?.questionGroupId
    );

    const group = elements.filter(
      (el: any) =>
        el.questionGroupId === selectedElement?.fieldElement?.questionGroupId
    );

    let findSelectedGroupPreviousGroup =
      questionGroups.findIndex(
        (el: any) => el === selectedElement?.fieldElement?.questionGroupId
      ) - 1;

    // if the selected group was the index 0
    // because we are subtracting it by 1 we have
    // to set it back to zero
    if (findSelectedGroupPreviousGroup === -1) {
      findSelectedGroupPreviousGroup = 0;
    }

    // The application of this is when there is a empty group
    // so there is no corresponding question related to it
    // exist in elements array so we find the last index of its
    // prevoius group and add one item after that
    const firstIndexAfterThePreviousSelectedGroup =
      elements.findLastIndex(
        (el: any) =>
          el.questionGroupId === questionGroups[findSelectedGroupPreviousGroup]
      ) + 1;

    delete element.temp;

    const finalFieldData = {
      ...element,
      title,
      position: selectedElement?.position?.apiPosition ?? group.length,
      questionPropertyList: data,
    };

    if (!selectedYet) {
      try {
        const { data }: any = await AxiosApi.post(
          "/question",
          finalFieldData as any
        );
        delete data.questionPropertyList;
        delete data.optionList;
        delete data.spectralPlaceList;
        const newData = {
          ...data,
        };

        const positionToUse =
          lastIndexOfGroup === -1
            ? firstIndexAfterThePreviousSelectedGroup
            : lastIndexOfGroup + 1;
        addElement(
          selectedElement?.position?.realPosition ?? positionToUse,
          newData
        );

        setOpenDialog(false);
        setSelectedElement(null);
        reset();
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const { data }: any = await AxiosApi.put(
          `/question/${finalFieldData.questionId}`,
          finalFieldData
        );
        delete data.questionPropertyList;
        delete data.optionList;
        delete data.spectralPlaceList;
        const newData = {
          ...data,
        };
        updateElement(element.questionId, newData);
        setOpenDialog(false);
        setSelectedElement(null);
        reset();
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          paddingX: 1.5,
          direction: "ltr",
          width: "100%",
        }}
      >
        <Stack spacing={1}>
          <Typography variant="subtitle2" fontWeight="700">
            متن سوال:
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              direction: "ltr",
              width: "100%",
              paddingX: 0.5,
              "& .MuiFormControl-root, & .MuiInputBase-root": {
                borderRadius: "10px",
              },
            }}
          >
            <RHFTextField multiline rows={3} name="title" />
          </Box>
        </Stack>

        <Stack spacing={1} marginTop={2.5}>
          <Typography variant="subtitle2" fontWeight="700">
            الگوی فیلد پاسخ:
          </Typography>
          <RHFMultiSelect
            name="TEXT_FIELD_PATTERN"
            options={fieldPatternOptions}
            setProp={setShowMinMaxProps}
            clearErros={clearErrors}
            setValue={setValue}
          />
        </Stack>

        {showMinMaxProps ? (
          <Box
            display="flex"
            gap={2}
            justifyContent="space-between"
            marginTop={2}
          >
            <Box width="100%">
              <Typography variant="subtitle2" fontWeight="700">
                حداقل کرکتر:
              </Typography>
              <RHFTextField name="MINIMUM_LEN" type="number" />
            </Box>
            <Box width="100%">
              <Typography variant="subtitle2" fontWeight="700">
                حداکثر کرکتر:
              </Typography>
              <RHFTextField name="MAXIMUM_LEN" type="number" />
            </Box>
          </Box>
        ) : null}

        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start"
          marginTop={3}
        >
          <Typography variant="subtitle2" fontWeight="700">
            پاسخ به سوال اجباری باشد
          </Typography>
          <RHFSwitch
            label=""
            name="REQUIRED"
            labelPlacement="start"
            sx={{ mb: 1, mx: 0, width: 1, justifyContent: "space-between" }}
          />
        </Stack>

        <Stack
          spacing={1}
          marginTop={1}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Typography variant="subtitle2" fontWeight="700">
            توضیحات
          </Typography>
          <SwitchButton
            onChange={() => setOpenDescriptionSwitch(!openDescriptionSwitch)}
            checked={openDescriptionSwitch}
          />
        </Stack>

        {openDescriptionSwitch && (
          <Stack marginTop={2}>
            <Typography variant="subtitle2" fontWeight="700" marginBottom={1.5}>
              متن توضیح:
            </Typography>
            <RHFTextField
              name="DESCRIPTION"
              placeholder="پیامی برای توضیح بیشتر در مورد این سوال"
            />
          </Stack>
        )}

        <FieldDialogActionBottomButtons status={isSubmitting} />
      </Box>
    </FormProvider>
  );
}
