"use client";

import React from "react";
import AnimatedBox from "@/templates/form/AnimatedBox";
import ActionButtons from "@/templates/form/ActionButtons";
import ReportDialog from "@/components/ReportDialog/ReportDialog";
import Header from "@/app/(participate)/form/[slug]/components/header";

interface QuestionStepProps {
  question: any;
  formName: string;
  formData: any;
  ValidatedInput: any;
  handleValidationUpdate: any;
  handleNext: () => void;
  handlePrev: () => void;
  questionLoading: boolean;
  isReportDialogOpen: boolean;
  handleOpenReportDialog: () => void;
  handleCloseReportDialog: () => void;
  formId: any;
  replace: (path: string) => void;
}

export function QuestionStep({
                               question,
                               formName,
                               formData,
                               ValidatedInput,
                               handleValidationUpdate,
                               handleNext,
                               handlePrev,
                               questionLoading,
                               isReportDialogOpen,
                               handleOpenReportDialog,
                               handleCloseReportDialog,
                               formId,
                               replace,
                             }: QuestionStepProps) {
  return (
    <div className="w-full flex flex-col p-4 overflow-hidden">
      <div className="flex flex-col bg-white rounded-xl h-[calc(100vh-120px)] md:h-full max-h-screen">
        {/* Header */}
        <Header formName={formName} handleOpenReportDialog={handleOpenReportDialog} replace={replace}/>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="w-full max-w-3xl mx-auto pb-6">
            {question && (
              <AnimatedBox key={question.questionId}>
                <ValidatedInput
                  key={question.id}
                  formData={formData}
                  elementInstance={question}
                  onValidationUpdate={handleValidationUpdate}
                />
              </AnimatedBox>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 w-full flex justify-between items-center px-2 py-4 rounded-xl">
          <ActionButtons
            loadingNext={questionLoading}
            disablePrev={questionLoading}
            nextAction={handleNext}
            prevAction={handlePrev}
          />
        </div>
      </div>

      <ReportDialog
        open={isReportDialogOpen}
        onClose={handleCloseReportDialog}
        formId={formId}
      />
    </div>
  );
}

export default QuestionStep;