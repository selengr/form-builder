"use client";

import { memo, useMemo } from "react";
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
import FormProvider from "../../components/hook-form/FormProvider";
import { RHFSwitch, RHFTextField } from "../../components/hook-form";
import FieldDialogActionBottomButtons from "../FieldDialogActionBottomButtons/FieldDialogActionBottomButtons";
import { IFormElementConstructor, IQPLInfoField } from "../../types/bulider";
import AxiosApi from "@/services/axios/AxiosApi";
import useDesigner from "@/hooks/useDesigner";
import useElements from "@/hooks/useElements";
import useActionOpenDialog from "@/hooks/useActionOpenDialog";
import useActionSelectedElement from "@/hooks/useActionSelectedElement";
import useSelectedElement from "@/hooks/useSelectedElement";
import useActionDesigner from "@/hooks/useActionDesigner";
import InformationIcon from "@/../public/images/home-page/information.svg";

const questionType: ElementsType = "INFO_FIELD";

const questionPropertyList: IQPLInfoField = [
  {
    id: 1,
    questionPropertyEnum: "MESSAGE",
    value: "",
  },
  {
    id: 2,
    questionPropertyEnum: "THE_END",
    value: "false",
  },
];

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
  MESSAGE: z.object({
    value: z
      .string()
      .trim()
      .transform((value) => value.replace(/\s+/g, " "))
      .pipe(z.string().max(250, { message: "حداکثر میتواند 250 کاراکتر باشد" }))
      .optional(),
    id: z.number(),
  }),
  THE_END: z.object({
    value: z.boolean().default(false),
    id: z.number(),
  }),
});

const DesignerComponent = memo(function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const labelText = element.title;
  const designerBtnLabel = InfoFieldFormElement.designerBtnElement.label;

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

export const InfoFieldFormElement: FormElement = {
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
    label: "بخش راهنما",
    icon: InformationIcon,
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
  elementInstance?: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const message = element.questionPropertyList.find(
    (el) => el.questionPropertyEnum === "MESSAGE"
  )?.value;

  return (
    <Box
      display="flex"
      gap={1}
      flexDirection="column"
      width="100%"
      maxWidth="600px"
    >
      <Box display="flex" justifyContent="space-between" width="100%">
        <Typography
          sx={{ marginRight: "25px", fontWeight: "600", fontSize: "18px" }}
        >
          {element.title}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" width="100%">
        <Typography
          sx={{ marginRight: "25px", fontWeight: "600", fontSize: "16px" }}
        >
          {message}
        </Typography>
      </Box>
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

        if (attribute.questionPropertyEnum === "THE_END") {
          acc[attribute.questionPropertyEnum].value =
            attribute.value === "true";
        } else if (attribute.questionPropertyEnum === "MESSAGE") {
          acc[attribute.questionPropertyEnum].value =
            attribute.value === null ? "" : attribute.value;
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
    reset,
    formState: { isSubmitting },
  } = methods;

  async function onSubmit(values: propertiesFormSchemaType) {
    const { title, THE_END, MESSAGE } = values;

    // finds whether a field is selected or not
    const selectedYet = elements?.find(
      (el: any) => el?.questionId === element?.questionId
    );

    const propertiesData = [
      {
        questionPropertyEnum: "THE_END",
        value: THE_END.value ? "true" : "false",
        id: selectedYet ? THE_END.id : null,
      },
      {
        questionPropertyEnum: "MESSAGE",
        value: MESSAGE.value,
        id: selectedYet ? MESSAGE.id : null,
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
    delete element.optionList;
    delete element.spectralPlaceList;

    const finalFieldData = {
      ...element,
      title,
      position: selectedElement?.position?.apiPosition ?? group.length,
      questionPropertyList: propertiesData,
    };

    if (!selectedYet) {
      const removeId: any = { ...finalFieldData };
      delete removeId.questionId;

      try {
        const { data }: any = await AxiosApi.post("/question", removeId as any);
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

        <Stack marginTop={2}>
          <Typography variant="subtitle2" fontWeight="700" marginBottom={1.5}>
            متن توضیح:
          </Typography>
          <RHFTextField
            name="MESSAGE.value"
            placeholder="پیامی برای توضیح بیشتر در رابطه با این سوال بنویسید."
          />
        </Stack>

        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start"
          marginTop={3}
        >
          <Typography variant="subtitle2" fontWeight="700">
            به جای صفحه پایان باشد
          </Typography>
          <RHFSwitch
            label=""
            name="THE_END.value"
            labelPlacement="start"
            sx={{ mb: 1, mx: 0, width: 1, justifyContent: "space-between" }}
          />
        </Stack>

        <FieldDialogActionBottomButtons status={isSubmitting} />
      </Box>
    </FormProvider>
  );
}
