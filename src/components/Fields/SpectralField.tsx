"use client";

import { memo, useState } from "react";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "../../types/FormElements";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack, Typography } from "@mui/material";
import FormProvider from "../../components/hook-form/FormProvider";
import {
  RHFMultiSelect,
  RHFSwitch,
  RHFTextField,
  RHFTextFieldOptionList,
} from "../../components/hook-form";
import FieldDialogActionBottomButtons from "../FieldDialogActionBottomButtons/FieldDialogActionBottomButtons";
import {
  IFormElementConstructor,
  IFormOptionList,
  IQPLSpectral,
  ISpectralQTapAndOptionsType,
} from "../../types/bulider";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import AxiosApi from "@/services/axios/AxiosApi";
import useElements from "@/hooks/useElements";
import useDesigner from "@/hooks/useDesigner";
import useActionOpenDialog from "@/hooks/useActionOpenDialog";
import useActionSelectedElement from "@/hooks/useActionSelectedElement";
import useSelectedElement from "@/hooks/useSelectedElement";
import useActionDesigner from "@/hooks/useActionDesigner";
import CheckIcon from "@/../public/images/home-page/spectral.svg";
import { SwitchButton } from "../Switch/SwitchButton";
import { MyRangeSlider } from "../Slider/RangeSlider";

const questionType: ElementsType = "SPECTRAL";

const questionPropertyList: IQPLSpectral = [
  {
    questionPropertyEnum: "SPECTRAL_TYPE",
    value: "CONTINUOUS",
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
    questionPropertyEnum: "SELECTION_TYPE",
    value: "SPECTRAL",
  },
  {
    questionPropertyEnum: "STEP",
    value: 0.1,
  },
  {
    questionPropertyEnum: "SPECTRAL_START",
    value: 0,
  },
  {
    questionPropertyEnum: "SPECTRAL_END",
    value: 100,
  },
];

const optionList: IFormOptionList[] = [
  {
    title: "گزینه 1",
    score: 0,
    id: null,
  },
  {
    title: "گزینه 2",
    score: 100,
    id: null,
  },
];

const spectralTypeOptions: ISpectralQTapAndOptionsType = [
  { value: "CONTINUOUS", label: "پیوسته" },
  { value: "DISCRETE", label: "گسسته" },
];

const tapTypeOptions: ISpectralQTapAndOptionsType = [
  { value: "SPECTRAL", label: "طیف" },
  { value: "DOMAIN", label: "دامنه" },
];

const optionsSchema = z.object({
  title: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, " "))
    .pipe(
      z
        .string()
        .min(1, { message: "حداقل باید 1 و حداکثر 20 کاراکتر داشته باشد" })
        .max(20, { message: "حداقل باید 1 و حداکثر 20 کاراکتر داشته باشد" })
    ),
  score: z
    .number()
    .min(0, { message: "نمیتواند منفی باشد" })
    .nonnegative({ message: "نمیتواند منفی باشد" }),
});

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
    SELECTION_TYPE: z.string(),
    SPECTRAL_TYPE: z.string(),
    STEP: z
      .number({ invalid_type_error: "اجباری است" })
      .min(0.1, { message: "باید از صفر بزرگتر باشد" }),
    DESCRIPTION: z
      .string()
      .trim()
      .transform((value) => value.replace(/\s+/g, " "))
      .pipe(z.string().max(250, { message: "حداکثر میتواند 250 کاراکتر باشد" }))
      .optional(),
    SPECTRAL_START: z
      .number({ invalid_type_error: "اجباری است" })
      .min(0, { message: "نمیتواند منفی باشد" })
      .nonnegative({ message: "نمیتواند منفی باشد" }),
    SPECTRAL_END: z
      .number({ invalid_type_error: "اجباری است" })
      .min(1, { message: "حداقل باید 1 باشد" })
      .positive({ message: "حداقل باید 1 باشد" }),
    REQUIRED: z.boolean().default(false),
    optionList: z
      .array(optionsSchema)
      .min(0, { message: "حداقل باید 2 و حداکثر 10 برچسب وجود داشته باشد" })
      .max(11, { message: "حداقل باید 2 و حداکثر 10 برچسب وجود داشته باشد" }),
  })
  .refine((val) => val.SPECTRAL_END >= val.SPECTRAL_START, {
    message: "پایان باید بزرگتر یا مساوی با شروع باشد",
    path: ["SPECTRAL_END"],
  })
  .refine(
    (val) => {
      if (val.SPECTRAL_END - val.SPECTRAL_START < val.STEP) return false;
      else return true;
    },
    {
      message: "گام نمیتواند از پایان بیشتر باشد",
      path: ["STEP"],
    }
  )
  .refine(
    (val) => {
      const distance = val.SPECTRAL_END - val.SPECTRAL_START;
      if (
        val.SPECTRAL_TYPE === "CONTINUOUS" ||
        val.SPECTRAL_TYPE === "DISCRETE"
      ) {
        if (Math.ceil(distance / val.STEP) + 1 < val.optionList.length)
          return false;
        else return true;
      }
    },
    {
      message: "برچسب‌ها نمی‌توانند از تعداد گام بین شروع و پایان بیشتر باشند",
      path: ["optionList"],
    }
  )
  .refine(
    (val) => {
      const scores = val.optionList.map((option) => option.score);
      const uniqueScores = [...(new Set(scores) as any)];
      return (
        scores.every(
          (score) => score >= val.SPECTRAL_START && score <= val.SPECTRAL_END
        ) && scores.length === uniqueScores.length
      );
    },
    {
      message:
        "هر مکان در محدوده شروع و پایان طیف یا دامنه باید منحصر به فرد باشد",
      path: ["optionList.score"],
    }
  )
  .refine(
    (val) => {
      if (val.SPECTRAL_TYPE === "DISCRETE") {
        return val.STEP >= 1 ? true : false;
      } else return true;
    },
    {
      message: "گام گسسته نمیتواند از 1 کمتر باشد",
      path: ["STEP"],
    }
  );

const DesignerComponent = memo(function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const labelText = element.title;
  const designerBtnLabel = SpectralFormElement.designerBtnElement.label;

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

export const SpectralFormElement: FormElement = {
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
    optionList: optionList,
  }),
  designerBtnElement: {
    label: "طیفی",
    icon: CheckIcon,
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
  optionList: typeof optionList;
};

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;

  const start: number = Number(
    element.questionPropertyList.find(
      (el) => el.questionPropertyEnum === "SPECTRAL_START"
    )?.value
  );
  const end: number = Number(
    element.questionPropertyList.find(
      (el) => el.questionPropertyEnum === "SPECTRAL_END"
    )?.value
  );
  const step: number = Number(
    element.questionPropertyList.find(
      (el) => el.questionPropertyEnum === "STEP"
    )?.value
  );

  const selectionType = element.questionPropertyList.find(
    (el) => el.questionPropertyEnum === "SELECTION_TYPE"
  )?.value;

  const [sliderValue, setSliderValue] = useState<number[] | number>(
    selectionType === "DOMAIN" ? [start, end] : start
  );

  const spectralType = element.questionPropertyList.find(
    (el) => el.questionPropertyEnum === "SPECTRAL_TYPE"
  )?.value;

  const marks = element.optionList.map((option) => {
    return { value: option.score, label: option.title };
  });

  const description = element.questionPropertyList.find(
    (el) => el.questionPropertyEnum === "DESCRIPTION"
  )?.value;

  const CustomValueLabel = ({ value }: { value: number }) => {
    const isMark = marks.some((mark) => mark.value === value);
    return (
      <Box>
        {isMark ? (
          <MdOutlineKeyboardArrowDown size={25} />
        ) : (
          <span>{value}</span>
        )}
      </Box>
    );
  };

  const handleChange = (event: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number[] | number);
  };

  return (
    <Box width="100%" maxWidth="1000px">
      <Typography
        sx={{
          marginBottom: description ? "0.5rem" : "3rem",
          fontSize: "1rem",
          fontWeight: "600",
        }}
      >
        {element.title}
      </Typography>
      {description && (
        <Typography
          sx={{ fontSize: "12px", fontWeight: "500", marginBottom: "3rem" }}
          variant="subtitle2"
        >
          {description}
        </Typography>
      )}
      {selectionType === "SPECTRAL" ? (
        <MyRangeSlider
          valueLabelFormat={(value: any) => <CustomValueLabel value={value} />}
          valueLabelDisplay="auto"
          value={sliderValue}
          step={step}
          onChange={handleChange}
          min={start}
          max={end}
          marks={marks}
        />
      ) : (
        <MyRangeSlider
          valueLabelFormat={(value: any) => <CustomValueLabel value={value} />}
          value={sliderValue}
          onChange={handleChange}
          size="medium"
          valueLabelDisplay="auto"
          step={spectralType === "DISCRETE" ? step : 0.1}
          min={start}
          max={end}
          marks={marks}
          disableSwap
        />
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
  const stepInputStatus: boolean = element.questionPropertyList.some(
    (property) => {
      if (property.questionPropertyEnum === "SPECTRAL_TYPE") {
        return property.value === "CONTINUOUS" ? true : false;
      } else {
        return false;
      }
    }
  );

  const [openDescriptionSwitch, setOpenDescriptionSwitch] = useState<boolean>(
    descriptionSwitchStatus
  );
  const [disableInput, setDisableInput] = useState<boolean>(stepInputStatus);
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
      } else if (
        attribute.questionPropertyEnum === "SPECTRAL_START" ||
        attribute.questionPropertyEnum === "SPECTRAL_END" ||
        attribute.questionPropertyEnum === "STEP"
      ) {
        acc[attribute.questionPropertyEnum] =
          attribute.value === "" ? 0 : Number(attribute.value);
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
  defaultValues.optionList = element.optionList;

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onSubmit",
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    clearErrors,
    formState: { isSubmitting, errors },
  } = methods;

  async function onSubmit(values: propertiesFormSchemaType) {
    const {
      title,
      DESCRIPTION,
      REQUIRED,
      SPECTRAL_TYPE,
      SELECTION_TYPE,
      STEP,
      SPECTRAL_START,
      SPECTRAL_END,
      optionList,
    } = values;

    // ? finds whether a field is selected or not
    const selectedYet = elements?.find(
      (el: any) => el?.questionId === element?.questionId
    );

    const data = [
      {
        questionPropertyEnum: "SPECTRAL_TYPE",
        value: SPECTRAL_TYPE,
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
        questionPropertyEnum: "SELECTION_TYPE",
        value: SELECTION_TYPE,
      },
      {
        questionPropertyEnum: "STEP",
        value: SPECTRAL_TYPE !== "CONTINUOUS" ? STEP : 0.1,
      },
      {
        questionPropertyEnum: "SPECTRAL_START",
        value: SPECTRAL_START,
      },
      {
        questionPropertyEnum: "SPECTRAL_END",
        value: SPECTRAL_END,
      },
    ];

    const optionListData = optionList;

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
      optionList: optionListData,
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
          <RHFTextField multiline rows={3} name="title" />
        </Stack>

        <Stack spacing={1} marginTop={2.5}>
          <Typography variant="subtitle2" fontWeight="700">
            نوع نوار لغزان:
          </Typography>
          <RHFMultiSelect name="SELECTION_TYPE" options={tapTypeOptions} />
        </Stack>

        <Stack spacing={1} marginTop={2.5}>
          <Typography variant="subtitle2" fontWeight="700">
            نوع انتخاب:
          </Typography>
          <RHFMultiSelect
            setValue={setValue}
            name="SPECTRAL_TYPE"
            clearErros={clearErrors}
            options={spectralTypeOptions}
            setProp={setDisableInput}
          />
        </Stack>

        <Box
          display="flex"
          gap={2}
          justifyContent="space-between"
          marginTop={2.5}
        >
          <Box width="100%">
            <Typography variant="subtitle2" fontWeight="700">
              شروع:
            </Typography>
            <RHFTextField name="SPECTRAL_START" type="number" />
          </Box>
          <Box width="100%">
            <Typography variant="subtitle2" fontWeight="700">
              پایان:
            </Typography>
            <RHFTextField name="SPECTRAL_END" type="number" />
          </Box>
          <Box width="100%">
            <Typography variant="subtitle2" fontWeight="700">
              گام:
            </Typography>
            <RHFTextField
              disabled={disableInput}
              name="STEP"
              type="number"
              changeValueToDefault={disableInput}
            />
          </Box>
        </Box>

        <Stack>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginTop={3}
            marginBottom={0.5}
          >
            <Typography sx={{ width: "75%" }} fontWeight="700">
              برچسب:
            </Typography>
            <Typography sx={{ width: "12.5%" }} fontWeight="700">
              مکان:
            </Typography>
            <Typography sx={{ width: "12.5%" }}></Typography>
          </Box>
          <RHFTextFieldOptionList
            name="optionList"
            errorMessage={
              errors?.optionList?.root?.message ??
              // @ts-ignore
              errors?.optionList?.score?.message
            }
          />
        </Stack>

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
