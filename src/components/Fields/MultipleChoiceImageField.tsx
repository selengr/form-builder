"use client";

import { memo, useCallback, useMemo, useState } from "react";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "../../types/FormElements";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import FormProvider from "../../components/hook-form/FormProvider";
import { RHFSwitch, RHFTextField } from "../../components/hook-form";
import FieldDialogActionBottomButtons from "../FieldDialogActionBottomButtons/FieldDialogActionBottomButtons";
import {
  IFormElementConstructor,
  IFormOptionList,
  IQPLMultipleChoice,
} from "../../types/bulider";
import { UppyUploader } from "../../components/uploader/UppyUploader";
import shuffleArray from "@/lib/shuffle";
import { FiPlusCircle } from "react-icons/fi";
import AxiosApi from "@/services/axios/AxiosApi";
import useElements from "@/hooks/useElements";
import useDesigner from "@/hooks/useDesigner";
import useActionOpenDialog from "@/hooks/useActionOpenDialog";
import useActionSelectedElement from "@/hooks/useActionSelectedElement";
import useSelectedElement from "@/hooks/useSelectedElement";
import useActionDesigner from "@/hooks/useActionDesigner";
import { HiOutlineTrash } from "react-icons/hi2";
import ImageGalleryIcon from "@/../public/images/home-page/gallery-tick.svg";
import { SwitchButton } from "../Switch/SwitchButton";
import Image from "next/image";

const questionType: ElementsType = "MULTIPLE_CHOICE_IMAGE";

const questionPropertyList: IQPLMultipleChoice = [
  {
    id: 1,
    questionPropertyEnum: "MULTI_SELECT",
    value: "false",
  },
  {
    id: 2,
    questionPropertyEnum: "REQUIRED",
    value: "false",
  },
  {
    id: 3,
    questionPropertyEnum: "RANDOMIZE_OPTIONS",
    value: "false",
  },
  {
    id: 4,
    questionPropertyEnum: "DESCRIPTION",
    value: "",
  },
  {
    id: 5,
    questionPropertyEnum: "EDIT_ANSWER_LOCKED",
    value: "false",
  },
];

const optionList: IFormOptionList[] = [
  {
    title: "",
    score: 0,
    id: Math.random() * 100000,
  },
  {
    title: "",
    score: 0,
    id: Math.random() * 100000,
  },
];

const optionsSchema = z.object({
  title: z
    .string({
      invalid_type_error: "عکس باید آپلود شود",
      message: "عکس باید آپلود شود",
    })
    .min(8, { message: "عکس باید آپلود شود" })
    .max(64, { message: "عکس باید آپلود شود" }),
  score: z
    .number({ message: "اجباری", invalid_type_error: "اجباری" })
    .nonnegative({ message: "نمیتواند منفی باشد" })
    .min(0),
});

const propertiesSchema = z.object({
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
  DESCRIPTION: z.object({
    value: z
      .string()
      .trim()
      .transform((value) => value.replace(/\s+/g, " "))
      .pipe(z.string().max(250, { message: "حداکثر میتواند 250 کاراکتر باشد" }))
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
  RANDOMIZE_OPTIONS: z.object({
    value: z.boolean().default(false),
    id: z.number(),
  }),
  MULTI_SELECT: z.object({
    value: z.boolean().default(false),
    id: z.number(),
  }),
  optionList: z
    .array(optionsSchema, {
      message: "حداقل باید 2 و حداکثر 10 گزینه وجود داشته باشد",
    })
    .min(2, { message: "حداقل باید 2 و حداکثر 10 گزینه وجود داشته باشد" })
    .max(10, { message: "حداقل باید 2 و حداکثر 10 گزینه وجود داشته باشد" }),
});

const DesignerComponent = memo(function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const labelText = element.title;
  const designerBtnLabel =
    MultipleChoiceImageFormElement.designerBtnElement.label;

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

export const MultipleChoiceImageFormElement: FormElement = {
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
    label: "چند گزینه‌ای تصویری",
    icon: ImageGalleryIcon,
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
  const isMultipleChoiceSelectionAllowed: boolean =
    element?.questionPropertyList?.find(
      (el: any) => el?.questionPropertyEnum === "MULTI_SELECT"
    )?.value === "true";
  const [selectedValue, setSelectedValue] = useState<any[] | any>(
    !isMultipleChoiceSelectionAllowed ? null : []
  );
  const description = element?.questionPropertyList?.find(
    (el) => el.questionPropertyEnum === "DESCRIPTION"
  )?.value;
  const randomOptions =
    element?.questionPropertyList?.find(
      (el) => el?.questionPropertyEnum === "RANDOMIZE_OPTIONS"
    )?.value === "true";

  const [newOptionList] = useState(
    randomOptions
      ? shuffleArray(element?.optionList).slice()
      : element?.optionList.slice()
  );

  const handleChange = (event: any) => {
    const { value } = event.target;

    if (Array.isArray(selectedValue)) {
      setSelectedValue((prevSelected: any) => {
        if (prevSelected.includes(value)) {
          return prevSelected.filter((id: any) => id !== value);
        } else {
          return [...prevSelected, value];
        }
      });
    } else {
      setSelectedValue(value);
    }
  };

  return (
    <FormControl
      sx={{
        width: "100%",
        maxWidth: "1000px",
      }}
    >
      <FormLabel
        sx={{
          marginBottom: description ? "0.5rem" : "3rem",
          "&.MuiFormLabel-root.MuiFormLabel-colorPrimary.Mui-focused": {
            color: "#353535",
          },
        }}
        id={String(element?.questionId)}
      >
        {element.title}
      </FormLabel>
      {description && (
        <Typography
          sx={{ fontSize: "12px", fontWeight: "500", marginBottom: "3rem" }}
          variant="subtitle2"
        >
          {description}
        </Typography>
      )}
      {isMultipleChoiceSelectionAllowed ? (
        <FormGroup
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 4,
            "& .MuiCheckbox-root": {
              display: "none",
            },
          }}
        >
          {newOptionList?.map((option: any) => (
            <FormControlLabel
              sx={{
                "& img": {
                  width: { xs: "105px", sm: "164px" },
                  height: { xs: "105px", sm: "164px" },
                  borderRadius: "12px",
                },
              }}
              key={option?.id}
              control={
                <Checkbox
                  checked={selectedValue?.includes(String(option.id))}
                  onChange={handleChange}
                  value={option.id}
                />
              }
              label={
                <div
                  style={{
                    borderRadius: "10px",
                    outline: selectedValue?.includes(String(option.id))
                      ? "3px solid #1758BA"
                      : "3px solid transparent",
                    transition: "outline 0.5s ease",
                  }}
                >
                  <Image
                    width={64}
                    height={64}
                    alt=""
                    src={
                      process.env.NEXT_PUBLIC_BASE_URL +
                      "/filemanager" +
                      option?.link
                    }
                  />
                </div>
              }
            />
          ))}
        </FormGroup>
      ) : (
        <RadioGroup
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 4,
            "& .MuiRadio-root": {
              display: "none",
            },
          }}
          onChange={handleChange}
          name={String(element?.questionId)}
        >
          {newOptionList?.map((option: any) => (
            <FormControlLabel
              key={option?.id}
              value={option?.id}
              control={<Radio />}
              sx={{
                "& img": {
                  width: { xs: "105px", sm: "164px" },
                  height: { xs: "105px", sm: "164px" },
                  borderRadius: "12px",
                },
              }}
              label={
                <div
                  style={{
                    borderRadius: "10px",
                    outline:
                      Number(selectedValue) === option.id
                        ? "3px solid #1758BA"
                        : "3px solid transparent",
                    transition: "outline 0.5s ease",
                  }}
                >
                  <Image
                    width={64}
                    height={64}
                    alt=""
                    src={
                      process.env.NEXT_PUBLIC_BASE_URL +
                      "/filemanager" +
                      option?.link
                    }
                  />
                </div>
              }
            />
          ))}
        </RadioGroup>
      )}
    </FormControl>
  );
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const elements = useElements();
  const setOpenDialog = useActionOpenDialog();
  const setSelectedElement = useActionSelectedElement();
  const selectedElement = useSelectedElement();
  const { updateElement, addElement } = useActionDesigner();
  const { questionGroups } = useDesigner();
  const element = elementInstance as CustomInstance;
  const [openDescriptionSwitch, setOpenDescriptionSwitch] = useState<boolean>(
    () =>
      element.questionPropertyList.some((property) => {
        return (
          property.questionPropertyEnum === "DESCRIPTION" && property.value
        );
      })
  );

  // ^ Check to see why i have done this
  // ^ THE REASON BEHIND THAT
  // ^ WHY MATCHING ELEMENT MATTERS ??
  const defaultValues = useMemo(() => {
    const matchingElement = elements?.find(
      (el: any) => el?.questionId === element?.questionId
    );

    const optionListCopy = matchingElement ? [...element.optionList] : [];

    const values = element.questionPropertyList.reduce(
      (acc: any, attribute: any) => {
        if (!acc[attribute.questionPropertyEnum]) {
          acc[attribute.questionPropertyEnum] = {};
        }

        if (
          attribute.questionPropertyEnum === "REQUIRED" ||
          attribute.questionPropertyEnum === "RANDOMIZE_OPTIONS" ||
          attribute.questionPropertyEnum === "MULTI_SELECT" ||
          attribute.questionPropertyEnum === "EDIT_ANSWER_LOCKED"
        ) {
          acc[attribute.questionPropertyEnum].value =
            attribute.value === "true";
        } else if (attribute.questionPropertyEnum === "DESCRIPTION") {
          acc[attribute.questionPropertyEnum].value =
            attribute.value === null ? "" : attribute.value;
        } else {
          acc[attribute.questionPropertyEnum].value = attribute.value;
        }

        acc[attribute.questionPropertyEnum].id = attribute.id;

        return acc;
      },
      {}
    );

    values.title = element?.title;
    values.optionList = matchingElement
      ? optionListCopy.map((optionItem) => {
          delete optionItem?.position;
          delete optionItem?.isTarget;
          return optionItem;
        })
      : [];

    return values;
  }, []);

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues,
  });

  const {
    control,
    setValue,
    getValues,
    register,
    reset,
    handleSubmit,
    clearErrors,
    formState: { isSubmitting, errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "optionList",
  });

  const handleUppyUpload = useCallback(
    (index: number, data: string[]) => {
      setValue(`optionList.${index}.title`, data[0]);
      clearErrors(`optionList.${index}.title`);
    },
    [setValue, clearErrors]
  );

  const handleScoreChange = useCallback(
    (index: number, data: number) => {
      setValue(`optionList.${index}.score`, data);
    },
    [setValue]
  );

  const handleAddOption = useCallback(() => {
    if (fields.length >= 10) return;
    const random = Math.ceil(Math.random() * 100000);

    append({ id: random, title: "", score: 0 } as any);
    if (fields.length === 1) {
      clearErrors("optionList");
    }
  }, [append, clearErrors, fields.length]);

  async function onSubmit(values: propertiesFormSchemaType) {
    const {
      title,
      DESCRIPTION,
      REQUIRED,
      RANDOMIZE_OPTIONS,
      MULTI_SELECT,
      optionList,
      EDIT_ANSWER_LOCKED,
    } = values;

    // ? finds whether a field is selected or not
    const selectedYet = elements?.find(
      (el: any) => el?.questionId === element?.questionId
    );

    const propertiesData = [
      {
        questionPropertyEnum: "MULTI_SELECT",
        value: MULTI_SELECT.value ? "true" : "false",
        id: MULTI_SELECT.id,
      },
      {
        questionPropertyEnum: "RANDOMIZE_OPTIONS",
        value: RANDOMIZE_OPTIONS.value ? "true" : "false",
        id: RANDOMIZE_OPTIONS.id,
      },
      {
        questionPropertyEnum: "REQUIRED",
        value: REQUIRED.value ? "true" : "false",
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
    ];

    const newOptionList = optionList.map((upload: any) => {
      return {
        score: upload.score,
        title: upload.title,
      };
    });

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
      optionList: newOptionList,
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
        updateElement(element?.questionId, newData);
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

        <Box>
          <Box marginTop={3}>
            {fields.map((field: any, index: number) => (
              <Box
                key={field.id}
                display="flex"
                alignItems="flex-start"
                border="1px dashed #1758BA"
                borderRadius="10px"
                justifyContent="space-between"
                my={1.5}
                p={0.75}
              >
                {field?.link?.includes("/download/") ? (
                  <Image
                    width={64}
                    height={64}
                    alt=""
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "12px",
                    }}
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}/filemanager${field?.link}`}
                  />
                ) : (
                  <div>
                    <UppyUploader
                      sx={{}}
                      register={register(`optionList.${index}.title`)}
                      getData={(data: string[]) =>
                        handleUppyUpload(index, data)
                      }
                    />
                    <p className="text-[#D21425] text-[12px]">
                      {errors?.optionList &&
                        errors?.optionList[index]?.title?.message}
                    </p>
                  </div>
                )}
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap={2}
                >
                  <RHFTextField
                    name={`optionList.${index}.score`}
                    callBack={(data: number) => handleScoreChange(index, data)}
                    getRHF={getValues}
                    uploader={true}
                    type="number"
                    sx={{
                      width: "50px",
                      "& .MuiInputBase-input": {
                        textAlign: "center",
                        padding: "5px !important",
                      },
                      "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                        {
                          display: "none",
                        },
                      "& input[type=number]": {
                        MozAppearance: "textfield",
                      },
                    }}
                  />
                  <IconButton
                    aria-label="trash"
                    onClick={() => remove(index)}
                    sx={{
                      marginBottom: 0,
                      borderRadius: "10px",
                      border: "1px solid transparent",
                      borderColor: "#FA4D56",
                      color: "#FA4D56",
                    }}
                  >
                    <HiOutlineTrash size="1.5rem" color="#FA4D56" />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <p className="text-[#D21425] text-[12px] ml-2">
              {errors?.optionList?.message}
            </p>
            <p className="text-[#D21425] text-[12px] ml-2">
              {errors?.optionList?.root?.message}
            </p>
            <IconButton
              disabled={fields.length >= 10}
              onClick={handleAddOption}
              sx={{
                marginBottom: 0,
                borderRadius: "10px",
                border: "1px solid transparent",
                borderColor: "#1758BA",
                color: "#1758BA",
              }}
            >
              <FiPlusCircle size="1.5rem" color="#1758BA" />
            </IconButton>
          </Box>
        </Box>

        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start"
          marginTop={3}
        >
          <Typography variant="subtitle2" fontWeight="700">
            چند انتخابی
          </Typography>
          <RHFSwitch
            label=""
            name="MULTI_SELECT.value"
            labelPlacement="start"
            sx={{ mb: 1, mx: 0, width: 1, justifyContent: "space-between" }}
          />
        </Stack>

        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start"
          marginTop={1.5}
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
          marginTop={1.5}
        >
          <Typography variant="subtitle2" fontWeight="700">
            توضیع تصادفی گزینه‌ها
          </Typography>
          <RHFSwitch
            label=""
            name="RANDOMIZE_OPTIONS.value"
            labelPlacement="start"
            sx={{ mb: 1, mx: 0, width: 1, justifyContent: "space-between" }}
          />
        </Stack>

        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start"
          marginTop={1.5}
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
          marginTop={1.5}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start"
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
            <Typography fontWeight="700" variant="subtitle2" marginBottom={1.5}>
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
