"use client"
import { toast } from 'sonner';
import { useCallback, useState } from "react"
import { FormProvider, useWatch } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { Box, Button, Stack, Typography } from "@mui/material"

import { SubCondition } from "./SubCondition"
// components
import { CircleDivider } from "@/components/condition/CircleDivider"
import { SubmitButtons } from "@/components/condition/form/SubmitButtons"
// lib
import { formatContainText } from "@/lib/formatContainText"
import { TConditionData, type TConditionFormData, TSubConditionData } from "@/lib/CreateSoloReportSchema"
// hooks
import { IConditionalSystemProps, IPostCondition } from "@/types/conditionReportSolo"
import { createNewSubCondition, useConditionalForm } from "@/app/reports/create-solo/[id]/_hooks/useConditionalForm"
import { useGetQacWithOutFilter } from "@/app/reports/create-solo/[id]/_hooks/useGetQacWithOutFilter"
import { useGetOnlyAllQuestions } from "@/app/reports/create-solo/[id]/_hooks/useGetOnlyAllQuestions"
import { useGetOnlyAllCalculation } from "@/app/reports/create-solo/[id]/_hooks/useGetOnlyAllCalculation"
import { usePostCondition } from "@/app/reports/create-solo/[id]/_hooks/usePostCondition"
import AdvancedTextareaEditor from "@/components/AdvancedTextareaEditor/AdvancedTextareaEditor"
import { IDropdownItem } from "@/components/AdvancedTextareaEditor/types"
import { useFormValidation } from "@/app/reports/create-solo/[id]/_hooks/useFormValidation"
import { idGenerator } from '@/lib';
import { RHFSwitch } from '@/components/hook-form';


export const ConditionalSystem: React.FC<IConditionalSystemProps> = ({ handleClose, condition, isEdit = false }) => {
  const { id } = useParams();
  const { refresh } = useRouter()

  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const returnTextEdit = isEdit ? JSON.parse(condition?.returnText) : undefined

  const {
    methods, conditions, handleAddCondition, handleRemoveCondition, handleAddSubCondition, handleRemoveSubCondition,
  } = useConditionalForm(condition)

  const { qacWithOutFilterOptions, isFetchingQacWithOutFilter, qacWithOutFilter } = useGetQacWithOutFilter()
  const {
    onlyAllQuestions, onlyAllDateOptions, onlySomeQuestionsOptions, isFetchingOnlyAllQuestions
  } = useGetOnlyAllQuestions()
  const { onlyAllCalculationOptions, isFetchingOnlyAllCalculation } = useGetOnlyAllCalculation()

  const postCondition = usePostCondition(isEdit);

  const { validateAndHandleErrors } = useFormValidation({
    setValidationErrors,
  })

  const handleReturnTextChange = useCallback((data: any, index: number) => {

    methods.setValue(`conditions.${index}.returnText`, JSON.stringify(data))
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }, [validationErrors.length],)


  const onSubmit = (input: TConditionFormData) => {
    let flag: boolean = true

    const transformInputToOutput = (input: TConditionFormData): any => {
      return input.conditions.map((condition: TConditionData, index) => {
        const { subConditions, returnText,  displayIf  } = condition;

        const conditionSubConditions = displayIf ? subConditions : "false";

        const conditionFormula = displayIf ? Array.isArray(subConditions) &&
         subConditions.map((subCondition: TSubConditionData) => {
            const conditionType = subCondition.conditionType?.split("@")[0];
            const questionType = subCondition.questionType?.split("@")[0];
            const operatorType = subCondition.operatorType?.split("@")[0];
            const value = typeof subCondition.value !== 'object' ? subCondition.value?.split("@")[0] : subCondition.value;
            const logicalOperator = subCondition.logicalOperator?.split("@")[0];

            let formattedValue: string;

            if (operatorType === "OPTION") {
              if (typeof subCondition.value === 'object') {
                formattedValue = `{${Array.isArray(value) && value?.map((item: string) => item?.split("@")[0])}}`
              } else formattedValue = `{${value}}`;
            } else if (operatorType === "VALUE") {
              formattedValue = `{#v_${value}}`;
            } else if (operatorType === "TEXT") {
              if (conditionType === "#startWithText" || conditionType === "#endWithText") {
                formattedValue = `{"${value}"}`;
              } else if (conditionType === "!#containAnyText" || conditionType === "#containAnyText") {
                formattedValue = `{${formatContainText(value as string)}}`;
              } else if (conditionType === "#lenEqualText" || conditionType === "#lenGraterThanText" || conditionType === "!#lenGraterThanText") {
                formattedValue = `{#v_${value}}`;
              } else {
                formattedValue = value as string;
              }
            } else if (operatorType === "DATE") {
              formattedValue = `{#v_"${value}"}`;
            } else {
              formattedValue = value as string;
            }

            const baseCondition = `${conditionType}(${questionType.split("*")[1]},${formattedValue})`;

            return logicalOperator ? ` ${logicalOperator} ${baseCondition}` : baseCondition;
          })
          .join("") : "true";

    
        // const returnTextList = JSON.parse(returnText)
        // const unselectedDropdowns: IDropdownItem[] = returnTextList.dropdowns.filter((dropdown: IDropdownItem) => !dropdown.value || dropdown.value.trim() === "",)
        // const isValid = validateAndHandleErrors(unselectedDropdowns)
       
        // if (!isValid) {
        //   flag = false
        //   return toast.error("لطفا تمامي فيلدهاي خالي را انتخاب كنيد");
        // } else {
        //   flag = true
        // }

        return {
          formBuilderId: Number(id),
          conditionFormula: conditionFormula,
          returnText,
            frontConditionData: JSON.stringify({
            ...input.conditions[index],
            subConditions: conditionSubConditions, 
          }),
          // frontConditionData: JSON.stringify(input.conditions[index]), 
          ...(isEdit && { id: Number(condition.id) })
        };
      });
    };


    const output: IPostCondition[] = transformInputToOutput(input);
    postCondition.mutate({ data: output }, {
      onSuccess: () => {
        refresh()
        handleClose()
      }, onError: (error: any) => {
      },
    });
  };


  const handleConditionDisplay = (index : number) =>{
    if(methods.getValues(`conditions.${index}.displayIf`)){
      // methods.setValue(`conditions.${index}.subConditions`, "false")
      // methods.setValue(`conditions.${index}.displayIf`, true)
      // console.log("0111111111",conditions[0].subConditions)
    }else {
      // console.log(handleAddCondition())
      // methods.setValue(`conditions.${index}.subConditions`,  [handleAddSubCondition(0,0)])
      //     methods.setValue(`conditions.${index}.displayIf`, false)
    }
  }

  const ConditionDisplayChecker = ({ index, children }: { index: number; children: React.ReactNode }) => {
    const displayIf = useWatch({
      control: methods.control,
      name: `conditions.${index}.displayIf`,
      defaultValue: false,
    })

    return displayIf === false ? <>{children}</> : null
  }

  return (<Box
    sx={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", direction: "ltr" }}
  >
    <Typography
      variant="subtitle1"
      sx={{ display: "flex", justifyContent: "center", color: "#404040", fontWeight: 700 }}
    >
      افزودن خرده‌گزارش
    </Typography>
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>

        {conditions.map((condition, index) => (<Box key={idGenerator()} sx={{ width: "100%" }}>


          <Box
            sx={{
              ml: { xs: 0, md: 2 },
              display: "flex",
              alignItems: "start",
              gap: 1,
              position: "relative",
              flexDirection: { xs: "column" },
            }}
          >
            <AdvancedTextareaEditor
              label="نمایش بده"
              onDataChange={(data) => handleReturnTextChange(data, index)}
              initialData={returnTextEdit}
              qacWithOutFilter={qacWithOutFilter}
              validationErrors={validationErrors}
              hasError={!!methods.formState.errors.conditions?.[0]?.returnText}
            />

            <Stack sx={{display:"flex",flexDirection : "row" , alignItems: "center"}}>
              <RHFSwitch
                label=""
                name={`conditions.${index}.displayIf`}
                labelPlacement="start"
                sx={{ mb: 1, mx: 0, width: 1, justifyContent: "space-between" }}
                onClick={()=>handleConditionDisplay(index)}
              />
              <Typography sx={{ color: "#393939", fontSize: "14px", ml: 1 }}>نمایش بده به شرطی که</Typography>
            </Stack>
          </Box>

          <ConditionDisplayChecker index={index}>
                {Array.isArray(condition.subConditions) &&
                  condition.subConditions.map((subCondition, subIndex) => (
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
          />))}
           </ConditionDisplayChecker>
          <Box
            sx={{
              ml: { xs: 0, md: 2 },
              display: "flex",
              alignItems: "start",
              gap: 1,
              position: "relative",
              flexDirection: { xs: "column" },
            }}
          >
            {/* <Typography sx={{ color: "#393939", fontSize: "14px",ml:-1.3 }}>نمایش بده:</Typography>
                <TextFieldController  sx={{ minWidth: 240, ml: 0 }} name={`conditions.${index}.returnText`} type="string" /> */}


            {/*   <AdvancedTextareaEditor
              label="در غیر اینصورت نمایش بده:"
              onDataChange={(data) => handleElseReturnTextChange(data, index)}
              initialData={elseReturnTextEdit}
              qacWithOutFilter={qacWithOutFilter}
            />
         */}

            {index !== 0 && (
              <Box
                sx={{
                  width: "100%",
                  height: "50px",
                  marginTop: 1
                }}
              >
                <Button
                  onClick={() => handleRemoveCondition(index)}
                  sx={{
                    width: 113,
                    height: "50px",
                    bgcolor: "#FA4D560D",
                    borderRadius: "8px",
                    position: { lg: "absolute" },
                    right: { lg: 10 },
                    bottom: 0,
                    border: "1px solid #FA4D56",
                    "&:hover": { bgcolor: "#FA4D560D" },
                  }}
                >
                  <Typography sx={{ color: "#FA4D56", fontSize: "14px" }}>حذف این خرده‌گزارش</Typography>
                </Button>
              </Box>
            )}
          </Box>
          <CircleDivider />
        </Box>))}
        {!isEdit && (<Button
          variant="outlined"
          onClick={handleAddCondition}
          sx={{
            ml: 2, height: 50, maxWidth: 155, color: "white", bgcolor: "#1758BA", borderRadius: "8px",
          }}
        >
          افزودن شرط جدید
        </Button>)}
        <SubmitButtons isLoading={postCondition.isPending} handleClose={handleClose} />
      </form>
    </FormProvider>
  </Box>)
}
