"use client"
import { FormProvider } from "react-hook-form"
import { Box, Typography, Button } from "@mui/material"

import { SubCondition } from "./SubCondition"
// components
import { CircleDivider } from "@/components/calculation/CircleDivider"
import { SubmitButtons } from "@/components/calculation/form/SubmitButtons"
import { SelectController } from "@/components/calculation/form/SelectController"
// lib
import { formatContainText } from "@/lib/formatContainText"
import { type TConditionFormData , TConditionData, TSubConditionData } from "@/lib/conditionFormSchema"
// hooks
import { IPostConditionModel, IPostConditionModelList } from "@/types/condition"
import { useConditionalForm } from "@/app/(builder)/builder/[id]/condition/_hooks/useConditionalForm"
import { usePostCalculation } from "@/app/(builder)/builder/[id]/condition/_hooks/usePostCalculation"
import { useGetQacWithOutFilter } from "@/app/(builder)/builder/[id]/condition/_hooks/useGetQacWithOutFilter"
import { useGetOnlyAllQuestions } from "@/app/(builder)/builder/[id]/condition/_hooks/useGetOnlyAllQuestions"
import { useGetOnlyAllCalculation } from "@/app/(builder)/builder/[id]/condition/_hooks/useGetOnlyAllCalculation"
import { useParams } from "next/navigation"




export const ConditionalSystem: React.FC<IConditionalSystemProps> = ({
  open,
  setOpen,
  calcId,
}) => {
  const { id } = useParams();
  const {
    methods,
    conditions,
    handleAddCondition,
    handleRemoveCondition,
    handleAddSubCondition,
    handleRemoveSubCondition,
  } = useConditionalForm()

  const { qacWithOutFilter, qacWithOutFilterOptions, isFetchingQacWithOutFilter } = useGetQacWithOutFilter()
  const { onlyAllQuestions, onlyAllQuestionsOptions, onlySomeQuestionsOptions, isFetchingOnlyAllQuestions } =
    useGetOnlyAllQuestions()
  const { onlyAllCalculationOptions, isFetchingOnlyAllCalculation } = useGetOnlyAllCalculation()

  const postCalculation = usePostCalculation();

  const onSubmit = (input: TConditionFormData) => {
    console.log("Submitted data:", input);

    const transformInputToOutput = (input : TConditionFormData) : any => {
      return input.conditions.map((condition : TConditionData) => {
        const { subConditions, returnQuestionId, elseQuestionId } = condition;

        const conditionFormula = subConditions
          .map((subCondition : TSubConditionData) => {
            const {
              conditionType,
              questionType,
              operatorType,
              value,
              logicalOperator,
            } = subCondition;
    
            let formattedValue: string;

            if (operatorType === "OPTION") {
              formattedValue = `{${value}}`;
            } else if (operatorType === "VALUE") {
              formattedValue = `{#v_${value}}`;
            } else if (operatorType === "TEXT") {
              if (
                conditionType === "#startWithText" ||
                conditionType === "#endWithText"
              ) {
                formattedValue = `{"${value}"}`;
              } else if (
                conditionType === "!#containAnyText" ||
                conditionType === "#containAnyText"
              ) {
                formattedValue = `{${formatContainText(value as string)}}`;
              } else if (
                conditionType === "#lenEqualText" ||
                conditionType === "#lenGraterThanText" ||
                conditionType === "!#lenGraterThanText"
              ) {
                formattedValue = `{#v_${value}}`;
              } else {
                formattedValue = value as string;
              }
            } else if (operatorType === "DATE") {
              formattedValue = `{#v_"${value}"}`;
            } else {
              formattedValue = value as string;
            }

            const baseCondition = `${conditionType}(${
              questionType.split("*")[1]
            },${formattedValue})`;

            return logicalOperator
              ? ` ${logicalOperator} ${baseCondition}`
              : baseCondition;
          })
          .join("");

        return {
          conditionFormula: conditionFormula,
          formBuilderId: id,
          returnQuestionId: parseInt(condition.returnQuestionId.replace(/\D/g, ''), 10),
          elseQuestionId: parseInt(condition.elseQuestionId.replace(/\D/g, ''), 10),
          frontConditionData:".....test.........."
        };
      });
    };

    const output : IPostConditionModel[] = transformInputToOutput(input);
    const postCalculationData : IPostConditionModelList = {
      conditionModelList : output
    }
    console.log("output",output);   
    console.log("postCalculationData",postCalculationData);  
    
    postCalculation.mutate(
      { data: postCalculationData },
      {
        onSuccess: () => {
          // ...
        },
        onError: (error: any) => {
          // ...
        },
      }
    );
  };

  return (
    <Box
      sx={{ width: "100%", p: 3, display: "flex", flexDirection: "column", justifyContent: "center", direction: "ltr" }}
    >
      <Typography
        variant="subtitle1"
        sx={{ display: "flex", justifyContent: "center", color: "#404040", fontWeight: 700, mb: 1 }}
      >
        شرط
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {conditions.map((condition, index) => (
            <Box key={condition.id} sx={{ width: "100%" }}>
              {condition.subConditions.map((subCondition, subIndex) => (
                <SubCondition
                  key={subCondition.id}
                  index={index}
                  subIndex={subIndex}
                  onAddSubCondition={() => handleAddSubCondition(index, subIndex)}
                  onRemoveSubCondition={() => handleRemoveSubCondition(index, subIndex)}
                  qacWithOutFilterOptions={qacWithOutFilterOptions}
                  isFetchingQacWithOutFilter={isFetchingQacWithOutFilter}
                  onlySomeQuestionsOptions={onlySomeQuestionsOptions}
                  isFetchingOnlyAllQuestions={isFetchingOnlyAllQuestions}
                  onlyAllCalculationOptions={onlyAllCalculationOptions}
                  isFetchingOnlyAllCalculation={isFetchingOnlyAllCalculation}
                  onlyAllQuestions={onlyAllQuestions}
                />
              ))}
              <Box
                sx={{
                  ml: { xs: 0, md: 2 },
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                  flexDirection: { xs: "column", md: "row" },
                }}
              >
                <Typography sx={{ color: "#393939", fontSize: "14px" }}>برو به:</Typography>
                <SelectController
                  name={`conditions.${index}.returnQuestionId`}
                  options={onlyAllQuestionsOptions}
                  isLoading={isFetchingOnlyAllQuestions}
                  sx={{ minWidth: 240, ml: 5 }}
                />
                <Typography sx={{ color: "#393939", fontSize: "14px", mr: 4 }}>در غیر اینصورت برو به:</Typography>
                <SelectController
                  name={`conditions.${index}.elseQuestionId`}
                  options={onlyAllQuestionsOptions}
                  isLoading={isFetchingOnlyAllQuestions}
                  sx={{ minWidth: 300, width: 360 }}
                />
                {index !== 0 && (
                <Button
                  onClick={() => handleRemoveCondition(index)}
                  sx={{
                    width: 113,
                    height: "52px",
                    bgcolor: "#FA4D560D",
                    borderRadius: "8px",
                    border: "1px solid #FA4D56",
                    "&:hover": { bgcolor: "#FA4D560D" },
                  }}
                >
                  <Typography sx={{ color: "#FA4D56", fontSize: "14px" }}>حذف این شرط</Typography>
                </Button>
            )}
              </Box>
              <CircleDivider />
            </Box>
          ))}
          <Button
            variant="outlined"
            onClick={handleAddCondition}
            sx={{
              ml: 2,
              height: 52,
              maxWidth: 155,
              color: "white",
              bgcolor: "#1758BA",
              borderRadius: "8px",
            }}
          >
            افزودن شرط جدید
          </Button>
          <SubmitButtons />
        </form>
      </FormProvider>
    </Box>
  )
}

