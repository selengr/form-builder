import { memo } from "react";
import { Box, Typography } from "@mui/material";
import {
  ElementsType,
  FormElementInstance,
  FormElements,
} from "@/types/FormElements";
import useSelectedElement from "@/hooks/useSelectedElement";

const PropertiesFormSidebar = memo(function PropertiesFormSidebar() {
  const selectedElement = useSelectedElement();

  const PropertiesForm =
    FormElements[selectedElement!.fieldElement!.questionType as ElementsType]
      .propertiesComponent;

  const fieldLabel =
    FormElements[selectedElement!.fieldElement!.questionType as ElementsType]
      .designerBtnElement.label;

  const questionType = selectedElement!.fieldElement!.questionType;

  return (
    <Box
      sx={{
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        paddingBottom: 3,
      }}
      padding={1}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          marginBottom: 3,
        }}
      >
        <Typography
          variant="body2"
          component={"p"}
          sx={{ fontWeight: "bold", textAlign: "center", fontSize: "1.2rem" }}
        >
          {questionType === "TitleFieldStart" ||
          questionType === "TitleFieldFinish"
            ? `توضیحات ${fieldLabel}`
            : `سوال ${fieldLabel}`}
        </Typography>
      </Box>
      <PropertiesForm
        elementInstance={selectedElement!.fieldElement as FormElementInstance}
      />
    </Box>
  );
});

export default PropertiesFormSidebar;
