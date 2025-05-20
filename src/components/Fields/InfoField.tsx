"use client";

import React,{ useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import FormProvider from "../../components/hook-form/FormProvider";
import { RHFSwitch, RHFTextField } from "../../components/hook-form";
import FieldDialogActionBottomButtons from "../FieldDialogActionBottomButtons/FieldDialogActionBottomButtons";

import AxiosApi from "@/services/axios/AxiosApi";
import useDesigner from "@/hooks/useDesigner";
import useElements from "@/hooks/useElements";
import useActionOpenDialog from "@/hooks/useActionOpenDialog";
import useActionSelectedElement from "@/hooks/useActionSelectedElement";
import useSelectedElement from "@/hooks/useSelectedElement";
import useActionDesigner from "@/hooks/useActionDesigner";

import InformationIcon from "@/../public/images/home-page/information.svg";
import { ElementsType, FormElement, FormElementInstance } from "../../types/FormElements";
import { IFormElementConstructor, IQPLInfoField } from "../../types/bulider";

const questionType: ElementsType = "INFO_FIELD";

const questionPropertyList: IQPLInfoField = [
  { id: 1, questionPropertyEnum: "MESSAGE", value: "" },
  { id: 2, questionPropertyEnum: "THE_END", value: "false" },
];

const propertiesSchema = z.object({
  title: z.string().trim().min(1, "حداقل باید 1 و حداکثر 100 کاراکتر باشد").max(100),
  MESSAGE: z.object({
    value: z.string().max(1000, "حداکثر میتواند 1000 کاراکتر باشد").optional(),
    id: z.number(),
  }),
  THE_END: z.object({
    value: z.boolean().default(false),
    id: z.number(),
  }),
});

type CustomInstance = FormElementInstance & { questionPropertyList: typeof questionPropertyList };
type PropertiesFormValues = z.infer<typeof propertiesSchema>;

const DesignerComponent = React.memo(({ elementInstance }: { elementInstance: FormElementInstance }) => {
  const element = elementInstance as CustomInstance;

  return (
      <div className="flex items-start flex-col overflow-hidden absolute" dir="rtl" style={{ width: "calc(100% - 96px)" }}>
        <p dir="rtl" className="text-base overflow-hidden text-ellipsis w-full" style={{ textWrap: "nowrap", fontWeight: 700 }}>
          {element.title}
        </p>
        <p className="text-xs text-[#424242]">#بخش راهنما</p>
      </div>
  );
});

function FormComponent({ elementInstance }: { elementInstance?: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const message = element.questionPropertyList.find((el) => el.questionPropertyEnum === "MESSAGE")?.value;

  return (
      <Box display="flex" gap={1} flexDirection="column" width="100%" maxWidth="600px">
        <Typography sx={{ marginRight: 3, fontWeight: 600, fontSize: 18 }}>{element.title}</Typography>
        {message && <Typography sx={{ marginRight: 3, fontWeight: 600, fontSize: 16 }}>{message}</Typography>}
      </Box>
  );
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const elements = useElements();
  const setOpenDialog = useActionOpenDialog();
  const setSelectedElement = useActionSelectedElement();
  const selectedElement = useSelectedElement();
  const { updateElement, addElement } = useActionDesigner();
  const { questionGroups } = useDesigner();

  const defaultValues = useMemo(() => {
    const values = element.questionPropertyList.reduce((acc: any, attr) => {
      acc[attr.questionPropertyEnum] = {
        value: attr.questionPropertyEnum === "THE_END" ? attr.value === "true" : attr.value ?? "",
        id: attr.id,
      };
      return acc;
    }, {});
    values.title = element.title;
    return values;
  }, [element]);

  const methods = useForm<PropertiesFormValues>({
    resolver: zodResolver(propertiesSchema),
    mode: "onChange",
    defaultValues,
  });

  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  const onSubmit = async (values: PropertiesFormValues) => {
    const { title, MESSAGE, THE_END } = values;
    const selected = elements.find(el => el.questionId === element.questionId);

    const props = [
      { questionPropertyEnum: "THE_END", value: THE_END.value ? "true" : "false", id: selected ? THE_END.id : null },
      { questionPropertyEnum: "MESSAGE", value: MESSAGE.value, id: selected ? MESSAGE.id : null },
    ];

    const groupId = selectedElement?.fieldElement?.questionGroupId;
    const groupElements = elements.filter(el => el.questionGroupId === groupId);

    const prevGroupIdx = Math.max(
        questionGroups.findIndex(q => q === groupId) - 1,
        0
    );

    const insertIdx = elements.findLastIndex(el => el.questionGroupId === questionGroups[prevGroupIdx]) + 1;
    const lastIdxInGroup = elements.findLastIndex(el => el.questionGroupId === groupId);

    const newField = {
      ...element,
      title,
      position: selectedElement?.position?.apiPosition ?? groupElements.length,
      questionPropertyList: props,
    };

    try {
      if (!selected) {
        const { data } = await AxiosApi.post("/question", { ...newField, questionId: undefined });
        addElement(selectedElement?.position?.realPosition ?? insertIdx, data);
      } else {
        const { data } = await AxiosApi.put(`/question/${newField.questionId}`, newField);
        updateElement(newField.questionId, data);
      }

      setOpenDialog(false);
      setSelectedElement(null);
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", paddingX: 1.5, direction: "ltr", width: "100%" }}>
          <Stack spacing={1}>
            <Typography variant="subtitle2" fontWeight={700}>عنوان راهنما:</Typography>
            <Box sx={{ px: 0.5, "& .MuiFormControl-root, & .MuiInputBase-root": { borderRadius: "10px" } }}>
              <RHFTextField name="title" />
            </Box>
          </Stack>

          <Stack mt={2}>
            <Typography variant="subtitle2" fontWeight={700} mb={1.5}>متن راهنما:</Typography>
            <Box sx={{ px: 0.5, "& .MuiFormControl-root, & .MuiInputBase-root": { borderRadius: "10px" } }}>
              <RHFTextField
                  multiline
                  minRows={3}
                  maxRows={6}
                  name="MESSAGE.value"
                  placeholder="متن راهنمای خود را بنویسید."
              />
            </Box>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mt={3}>
            <Typography variant="subtitle2" fontWeight={700}>به جای صفحه پایان باشد</Typography>
            <RHFSwitch label="" name="THE_END.value" labelPlacement="start" sx={{ mb: 1, mx: 0, width: 1, justifyContent: "space-between" }} />
          </Stack>

          <FieldDialogActionBottomButtons status={isSubmitting} />
        </Box>
      </FormProvider>
  );
}

export const InfoFieldFormElement: FormElement = {
  questionType,
  construct: ({ questionId, questionGroupId, formId, title, position }: IFormElementConstructor) => ({
    questionId,
    questionGroupId,
    formId,
    title,
    questionType,
    position,
    questionPropertyList,
  }),
  designerBtnElement: { label: "بخش راهنما", icon: InformationIcon },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement, currentValue) => {
    const element = formElement as CustomInstance;
    return !element.questionPropertyList.required || currentValue.length > 0;
  },
};
