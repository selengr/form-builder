"use client";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "../../types/FormElements";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useDesigner from "@/hooks/useDesigner";
import Box from "@mui/material/Box";
import FormProvider from "../../components/hook-form/FormProvider";
import RHFTextField from "../../components/hook-form/RHFTextField";
import FieldDialogActionBottomButtons from "../FieldDialogActionBottomButtons/FieldDialogActionBottomButtons";
import { IFormElementConstructor } from "../../types/bulider";
import { useParams } from "next/navigation";
import AxiosApi from "@/services/axios/AxiosApi";
import useActionOpenDialog from "@/hooks/useActionOpenDialog";
import useActionSelectedElement from "@/hooks/useActionSelectedElement";
import useSelectedElement from "@/hooks/useSelectedElement";
import useActionDesigner from "@/hooks/useActionDesigner";
import { toast } from "sonner";
import { memo } from "react";

const questionType: ElementsType = "TitleFieldFinish";

const propertiesSchema = z.object({
  description: z
    .string({ message: "حداقل باید 1 و حداکثر 250 کاراکتر باشد" })
    .trim()
    .transform((value) => value.replace(/\s+/g, " "))
    .pipe(
      z
        .string({ message: "حداقل باید 1 و حداکثر 250 کاراکتر باشد" })
        .min(1, { message: "حداقل باید 1 و حداکثر 250 کاراکتر باشد" })
        .max(250, { message: "حداقل باید 1 و حداکثر 250 کاراکتر باشد" })
    ),
});

const DesignerComponent = memo(function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const { label } = TitleFieldFinishFormElement.designerBtnElement;
  const description = elementInstance?.description;

  return (
    <div
      className="flex items-start flex-col overflow-hidden absolute"
      dir="rtl"
      style={{
        width: "calc(100% - 56px)",
      }}
    >
      <p
        dir="rtl"
        className="text-base overflow-hidden text-ellipsis w-full"
        style={{ textWrap: "nowrap", fontWeight: "700" }}
      >
        {description}
      </p>
      <p className="text-xs">#{label}</p>
    </div>
  );
});

export const TitleFieldFinishFormElement: FormElement = {
  questionType,
  construct: ({ questionId, description }: IFormElementConstructor) => ({
    questionId,
    description,
    questionType,
  }),
  designerBtnElement: {
    label: "پایان پرسشنامه",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => true,
};

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  // const { title } = element.questionPropertyList;
  return <p className="text-xl"></p>;
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const { id } = useParams();
  const element = elementInstance;
  const setOpenDialog = useActionOpenDialog();
  const setSelectedElement = useActionSelectedElement();
  const selectedElement = useSelectedElement();
  const { updateFinishPage, addFinishPage } = useActionDesigner();
  const { finishPage } = useDesigner();

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onSubmit",
    defaultValues: {
      description: element.description,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  async function applyChanges(values: propertiesFormSchemaType) {
    const { description } = values;

    const data = {
      formId: id,
      description: description,
      endPageId: element.questionId,
    };

    if (!finishPage) {
      try {
        const res: any = await AxiosApi.post("/form/end-page", data as any);
        addFinishPage({
          ...selectedElement?.fieldElement,
          questionId: res?.data?.endPageId,
          description: res?.data?.description,
        } as FormElementInstance);
        toast.success("صفحه پایان با موفقیت افزوده شد");
        setOpenDialog(false);
        setSelectedElement(null);
        reset();
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const res = await AxiosApi.put("/form/end-page", data as any);
        updateFinishPage({
          ...element,
          description: res?.data?.description,
        });
        setOpenDialog(false);
        setSelectedElement(null);
        reset();
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(applyChanges)}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          direction: "ltr",
          width: "100%",
          paddingX: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            direction: "ltr",
            width: "100%",
            paddingX: 1.5,
            "& .MuiFormControl-root, & .MuiInputBase-root": {
              borderRadius: "10px",
            },
          }}
        >
          <RHFTextField multiline rows={5} name="description" />
        </Box>
        <FieldDialogActionBottomButtons status={isSubmitting} />
      </Box>
    </FormProvider>
  );
}
