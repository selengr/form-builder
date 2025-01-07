"use client";

import { Fragment, memo, useMemo, useState } from "react";
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
    id: 1,
    questionPropertyEnum: "TEXT_FIELD_PATTERN",
    value: "SHORT_TEXT",
  },
  {
    id: 2,
    questionPropertyEnum: "REQUIRED",
    value: "false",
  },
  {
    id: 3,
    questionPropertyEnum: "DESCRIPTION",
    value: "",
  },
  {
    id: 4,
    questionPropertyEnum: "MINIMUM_LEN",
    value: 1,
  },
  {
    id: 5,
    questionPropertyEnum: "MAXIMUM_LEN",
    value: 250,
  },
  {
    id: 6,
    questionPropertyEnum: "EDIT_ANSWER_LOCKED",
    value: "false",
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
    MINIMUM_LEN: z.object({
      value: z
        .number({ invalid_type_error: "اجباری است" })
        .min(1, { message: "حداقل باید 1 کاراکتر باشد" }),
      id: z.number(),
    }),
    MAXIMUM_LEN: z.object({
      value: z
        .number({ invalid_type_error: "اجباری است" })
        .min(1, { message: "حداقل باید 1 کاراکتر باشد" }),
      id: z.number(),
    }),
    DESCRIPTION: z.object({
      value: z
        .string()
        .trim()
        .transform((value) => value.replace(/\s+/g, " "))
        .pipe(
          z.string().max(250, { message: "حداکثر میتواند 250 کاراکتر باشد" })
        )
        .optional(),
      id: z.number(),
    }),
    REQUIRED: z.object({
      value: z.boolean().default(false),
      id: z.number(),
    }),
    EDIT_ANSWER_LOCKED: z.object({
      value: z.boolean().default(false),
      id: z.number(),
    }),
    TEXT_FIELD_PATTERN: z.object({
      value: z.string().min(1, { message: "الزامی است" }),
      id: z.number(),
    }),
  })
  .refine((val) => val.MAXIMUM_LEN >= val.MINIMUM_LEN, {
    message: "حداکثر باید از حداقل بیشتر باشد",
    path: ["MAXIMUM_LEN"],
  })
  .refine(
    (val) => {
      if (val.TEXT_FIELD_PATTERN.value === "LONG_TEXT") {
        return val.MAXIMUM_LEN.value <= 1000;
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
      if (val.TEXT_FIELD_PATTERN.value === "SHORT_TEXT") {
        return val.MAXIMUM_LEN.value <= 250;
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
            type="text"
            sx={{
              "& .MuiInputBase-root": {
                padding: 1.5,
              },
              "& input": {
                padding: 0,
              },
            }}
            slotProps={{
              htmlInput: {
                maxLength: 15,
                pattern: "^-?\\d*\\.?\\d*$",
                onInput: (e: any) => {
                  const value = e.target.value;

                  let newValue = value
                    .replace(/[^0-9.-]/g, "")
                    .replace(/(?!^)-/g, "")
                    .replace(/(\..*)\..*/g, "$1");

                  if (newValue.startsWith(".")) {
                    newValue = newValue.substring(1);
                  }

                  if (
                    newValue.startsWith("-") &&
                    newValue.length > 1 &&
                    !/^\d/.test(newValue[1])
                  ) {
                    newValue = "-";
                  }

                  e.target.value = newValue;
                },
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
            type="text"
            sx={{
              "& .MuiInputBase-root": {
                padding: 1.5,
              },
              "& input": {
                padding: 0,
              },
            }}
            slotProps={{
              htmlInput: {
                maxLength: 10,
                pattern: "[0-9]*",
                onInput: (e: any) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                },
              },
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
            type="text"
            placeholder="09358956545"
            slotProps={{
              htmlInput: {
                maxLength: 11,
                pattern: "[0-9]*",
                onInput: (e: any) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                },
              },
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
            {min + " / " + max}
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
  const [showMinMaxProps, setShowMinMaxProps] = useState<boolean>(() => {
    const textFieldPatternVal = element.questionPropertyList.find(
      (prop) => prop.questionPropertyEnum === "TEXT_FIELD_PATTERN"
    )?.value;

    return (
      textFieldPatternVal === "SHORT_TEXT" ||
      textFieldPatternVal === "LONG_TEXT"
    );
  });
  const [openDescriptionSwitch, setOpenDescriptionSwitch] = useState<boolean>(
    () =>
      element.questionPropertyList.some((property) => {
        return (
          property.questionPropertyEnum === "DESCRIPTION" && property.value
        );
      })
  );
  const elements = useElements();
  const setOpenDialog = useActionOpenDialog();
  const setSelectedElement = useActionSelectedElement();
  const selectedElement = useSelectedElement();
  const { updateElement, addElement } = useActionDesigner();
  const { questionGroups } = useDesigner();

  const defaultValues = useMemo(() => {
    const values = element.questionPropertyList.reduce(
      (acc: any, attribute) => {
        if (!acc[attribute.questionPropertyEnum]) {
          acc[attribute.questionPropertyEnum] = {};
        }

        if (attribute.questionPropertyEnum === "REQUIRED") {
          acc[attribute.questionPropertyEnum].value =
            attribute.value === "true";
        } else if (attribute.questionPropertyEnum === "MINIMUM_LEN") {
          acc[attribute.questionPropertyEnum].value =
            attribute.value === "" || attribute.value === null
              ? 1
              : Number(attribute.value);
        } else if (attribute.questionPropertyEnum === "MAXIMUM_LEN") {
          acc[attribute.questionPropertyEnum].value =
            attribute.value === "" || attribute.value === null
              ? 250
              : Number(attribute.value);
        } else if (attribute.questionPropertyEnum === "DESCRIPTION") {
          acc[attribute.questionPropertyEnum].value =
            attribute.value === null ? "" : attribute.value;
        } else if (attribute.questionPropertyEnum === "EDIT_ANSWER_LOCKED") {
          acc[attribute.questionPropertyEnum].value =
            attribute.value === "true";
        } else {
          acc[attribute.questionPropertyEnum].value = attribute.value;
        }

        acc[attribute.questionPropertyEnum].id = attribute.id;

        return acc;
      },
      {}
    );
    values.title = element.title;

    return values;
  }, []);

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
      EDIT_ANSWER_LOCKED,
    } = values;

    // finds whether a field is selected or not
    const selectedYet = elements?.find(
      (el: any) => el?.questionId === element?.questionId
    );

    const isTextInputsSelected =
      TEXT_FIELD_PATTERN.value === "SHORT_TEXT" ||
      TEXT_FIELD_PATTERN.value === "LONG_TEXT";

    const propertiesData = [
      {
        questionPropertyEnum: "TEXT_FIELD_PATTERN",
        value: TEXT_FIELD_PATTERN.value,
        id: TEXT_FIELD_PATTERN.id,
        // id: 3330, // ^ wrong data update with no error then reverts back
      },
      {
        questionPropertyEnum: "REQUIRED",
        value: REQUIRED ? "true" : "false",
        id: REQUIRED.id,
      },
      {
        questionPropertyEnum: "EDIT_ANSWER_LOCKED",
        value: EDIT_ANSWER_LOCKED ? "true" : "false",
        id: EDIT_ANSWER_LOCKED.id,
      },
      {
        questionPropertyEnum: "DESCRIPTION",
        value:
          openDescriptionSwitch && DESCRIPTION.value ? DESCRIPTION.value : null,
        id: DESCRIPTION.id,
      },
      {
        questionPropertyEnum: "MAXIMUM_LEN",
        value: isTextInputsSelected ? MAXIMUM_LEN.value : null,
        id: MAXIMUM_LEN.id,
      },
      {
        questionPropertyEnum: "MINIMUM_LEN",
        value: isTextInputsSelected ? MINIMUM_LEN.value : null,
        id: MINIMUM_LEN.id,
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
      questionPropertyList: propertiesData,
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
            name="TEXT_FIELD_PATTERN.value"
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
              <RHFTextField name="MINIMUM_LEN.value" type="number" />
            </Box>
            <Box width="100%">
              <Typography variant="subtitle2" fontWeight="700">
                حداکثر کرکتر:
              </Typography>
              <RHFTextField name="MAXIMUM_LEN.value" type="number" />
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
            name="REQUIRED.value"
            labelPlacement="start"
            sx={{ mb: 1, mx: 0, width: 1, justifyContent: "space-between" }}
          />
        </Stack>

        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start"
          marginTop={3}
        >
          <Typography variant="subtitle2" fontWeight="700">
            پاسخ غیر قابل ویرایش
          </Typography>
          <RHFSwitch
            label=""
            name="EDIT_ANSWER_LOCKED.value"
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
            onChange={() => setOpenDescriptionSwitch((prev) => !prev)}
            checked={openDescriptionSwitch}
          />
        </Stack>

        {openDescriptionSwitch && (
          <Stack marginTop={2}>
            <Typography variant="subtitle2" fontWeight="700" marginBottom={1.5}>
              متن توضیح:
            </Typography>
            <RHFTextField
              name="DESCRIPTION.value"
              placeholder="پیامی برای توضیح بیشتر در مورد این سوال"
            />
          </Stack>
        )}

        <FieldDialogActionBottomButtons status={isSubmitting} />
      </Box>
    </FormProvider>
  );
}
