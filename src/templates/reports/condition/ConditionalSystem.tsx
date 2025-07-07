"use client"
import { toast } from 'sonner';
import { useCallback, useState } from "react"
import { FormProvider } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { Box, Typography, Button } from "@mui/material"

import { SubCondition } from "./SubCondition"
// components
import { CircleDivider } from "@/components/condition/CircleDivider"
import { SubmitButtons } from "@/components/condition/form/SubmitButtons"
import { TextFieldController } from "@/components/condition/form/TextFieldController"
// lib
import { formatContainText } from "@/lib/formatContainText"
import { type TConditionFormData , TConditionData, TSubConditionData } from "@/lib/CreateSoloReportSchema"
// hooks
import { IConditionalSystemProps, IPostCondition } from "@/types/conditionReportSolo"
import { useConditionalForm } from "@/app/reports/create-solo/[id]/_hooks/useConditionalForm"
import { useGetQacWithOutFilter } from "@/app/reports/create-solo/[id]/_hooks/useGetQacWithOutFilter"
import { useGetOnlyAllQuestions } from "@/app/reports/create-solo/[id]/_hooks/useGetOnlyAllQuestions"
import { useGetOnlyAllCalculation } from "@/app/reports/create-solo/[id]/_hooks/useGetOnlyAllCalculation"
import { usePostCondition } from "@/app/reports/create-solo/[id]/_hooks/usePostCondition"
import AdvancedTextareaEditor from "@/components/AdvancedTextareaEditor/AdvancedTextareaEditor"
import { IDropdownItem } from "@/components/AdvancedTextareaEditor/types"
import { useEditorValidation } from "@/app/reports/create-solo/[id]/_hooks/useEditorValidation"
import { useFormValidation } from "@/app/reports/create-solo/[id]/_hooks/useFormValidation"


export const ConditionalSystem: React.FC<IConditionalSystemProps> = ({
  handleClose,
  condition,
  isEdit = false
}) => {
  const { id } = useParams();
  const {refresh} = useRouter()

  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const returnTextEdit = isEdit ? JSON.parse(condition?.returnText) : undefined
  const elseReturnTextEdit = isEdit ? JSON.parse(condition?.elseReturnText) : undefined

  const {
    methods,
    conditions,
    handleAddCondition,
    handleRemoveCondition,
    handleAddSubCondition,
    handleRemoveSubCondition,
  } = useConditionalForm(condition)

  const { qacWithOutFilterOptions, isFetchingQacWithOutFilter, qacWithOutFilter } = useGetQacWithOutFilter()
  const {
     onlyAllQuestions,
     onlyAllDateOptions, 
      onlySomeQuestionsOptions,
       isFetchingOnlyAllQuestions
       } = useGetOnlyAllQuestions()
  const { onlyAllCalculationOptions, isFetchingOnlyAllCalculation } = useGetOnlyAllCalculation()

  const postCondition = usePostCondition(isEdit);

    const { validateAndHandleErrors, showSuccessMessage } = useFormValidation({
    setValidationErrors,
  })

 const handleReturnTextChange = useCallback(
    (data: any,index:number) => {
      methods.setValue(`conditions.${index}.returnText`,JSON.stringify(data))
      if (validationErrors.length > 0) {
        setValidationErrors([])
      }
    },
    [validationErrors.length],
  )

  const handleElseReturnTextChange = (data: any,index:number) => {
    methods.setValue(`conditions.${index}.elseReturnText`,JSON.stringify(data))
  }


  const onSubmit = (input: TConditionFormData) => {
        let flag : boolean = true

    const transformInputToOutput = (input : TConditionFormData) : any => {
      return input.conditions.map((condition : TConditionData,index) => {
        const { subConditions, returnText, elseReturnText } = condition;

        const conditionFormula = subConditions
          .map((subCondition : TSubConditionData) => {
            const conditionType = subCondition.conditionType?.split("@")[0];
            const questionType = subCondition.questionType?.split("@")[0];
            const operatorType = subCondition.operatorType?.split("@")[0];
            const value = typeof subCondition.value !== 'object' ? subCondition.value?.split("@")[0] : subCondition.value;
            const logicalOperator = subCondition.logicalOperator?.split("@")[0];
    
            let formattedValue: string;

            if (operatorType === "OPTION") {
              if(typeof subCondition.value === 'object'){
                formattedValue = `{${Array.isArray(value) && value?.map((item:string)=>item?.split("@")[0])}}`
              } else formattedValue = `{${value}}`;
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

       const returnTextList = JSON.parse(returnText)
       const elseReturnTextList = JSON.parse(elseReturnText)
c
          const unselectedDropdowns : IDropdownItem[] = returnTextList.dropdowns.filter(
            (dropdown : IDropdownItem) => !dropdown.value || dropdown.value.trim() === "",
          )

          const unselectedElseDropdowns : IDropdownItem[] = elseReturnTextList.dropdowns.filter(
            (dropdown : IDropdownItem) => !dropdown.value || dropdown.value.trim() === "",
          )

          const isValid = validateAndHandleErrors(unselectedDropdowns)
          const isValidElse = validateAndHandleErrors(unselectedElseDropdowns)
        if(!isValid && !isValidElse) {
          flag = false
              return toast.error("لطفا تمامي فيلدهاي خالي را انتخاب كنيد");
        } else {
          flag = true
        }

        return {
          formBuilderId: Number(id),
          conditionFormula: conditionFormula,
          elseReturnText,
          returnText,
          frontConditionData: JSON.stringify(input.conditions[index]),
          ...(isEdit && { id: Number(condition.id) }) 
        };
      });
    };



    const output : IPostCondition[] = transformInputToOutput(input);
    postCondition.mutate(
      { data: output },
      {
        onSuccess: () => {
          refresh()
          handleClose()
        },
        onError: (error: any) => {
          // ...
        },
      }
    );
  };

  return (
    <Box
      sx={{ width: "100%",  display: "flex", flexDirection: "column", justifyContent: "center", direction: "ltr" }}
    >
      <Typography
        variant="subtitle1"
        sx={{ display: "flex", justifyContent: "center", color: "#404040", fontWeight: 700, mb: 1 }}
      >
        افزودن خرده‌گزارش 
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
                  onlyAllDateOptions={onlyAllDateOptions}
                />
              ))}
              <Box
                sx={{
                  ml: { xs: 0, md: 2 },
                  display: "flex",
                  alignItems: "start",
                  gap: 1,
                  position : "relative",
                  flexDirection: { xs: "column"},
                }}
              >
                {/* <Typography sx={{ color: "#393939", fontSize: "14px",ml:-1.3 }}>نمایش بده:</Typography>
                <TextFieldController  sx={{ minWidth: 240, ml: 0 }} name={`conditions.${index}.returnText`} type="string" /> */}
    
                 <AdvancedTextareaEditor 
                 label="نمایش بده"
                 onDataChange={(data)=>handleReturnTextChange(data,index)}
                 initialData={returnTextEdit} 
                 methods={methods.setValue} 
                 qacWithOutFilter={qacWithOutFilter}
                 validationErrors={validationErrors}
                 />
                 <AdvancedTextareaEditor 
                    label="در غیر اینصورت نمایش بده:"
                    onDataChange={(data)=>handleElseReturnTextChange(data,index)}
                    initialData={elseReturnTextEdit} 
                    methods={methods.setValue} 
                    qacWithOutFilter={qacWithOutFilter}
                 />
  
              
{/* 
                <Typography sx={{color: "#393939", fontSize: "14px", mr: 0 }}>در غیر اینصورت نمایش بده:</Typography>
                
                <TextFieldController sx={{ minWidth: 300, width: 380 }} name={`conditions.${index}.elseReturnText`} type="string" /> */}
               
               
               
                {index !== 0 && (
                <Button
                  onClick={() => handleRemoveCondition(index)}
                  sx={{
                    width: 113,
                    height: "50px",
                    bgcolor: "#FA4D560D",
                    borderRadius: "8px",
                       position : {lg:"absolute"},
                    right : {lg: 10},
                    bottom : 0,
                    border: "1px solid #FA4D56",
                    "&:hover": { bgcolor: "#FA4D560D" },
                  }}
                >
                  <Typography sx={{ color: "#FA4D56", fontSize: "14px" }}>حذف این خرده‌گزارش</Typography>
                </Button>
            )}
              </Box>
              <CircleDivider />
            </Box>
          ))}
          {!isEdit && (
            <Button
            variant="outlined"
            onClick={handleAddCondition}
            sx={{
              ml: 2,
              height: 50,
              maxWidth: 155,
              color: "white",
              bgcolor: "#1758BA",
              borderRadius: "8px",
            }}
          >
            افزودن شرط جدید
          </Button>
          )}
          <SubmitButtons isLoading={postCondition.isPending} handleClose={handleClose}/>
        </form>
      </FormProvider>
    </Box>
  )
}
