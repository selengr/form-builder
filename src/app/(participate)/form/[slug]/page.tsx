'use client';

import React, { useState } from 'react';
import FormLimitation from '@/templates/form/FormLimitation';
import { useParticipateForm } from '@/hooks/useParticipateForm';
import ResponsiveContainer from '@/templates/form/ContentWrapper';
import { ErrorStep, FinishStep, QuestionStep } from './components';
import { ParticipateLoadingSkeleton } from './components/participateSkeleton';

export default function ParticipateFormPage({ params }: { params: { slug: string } }) {
  const [limitationStepPassed, setLimitationStepPassed] = useState(false);

  const {
    firstLoading,
    questionLoading,
    finishPage,
    limitation,
    question,
    formData,
    formName,
    setFormName,
    ValidatedInput,
    handleValidationUpdate,
    handleNext,
    handlePrev,
    replace,
    setLimitation,
    setQuestion,
    initializeQuestion,
    realFormID,
    hasError,
    takePartId,
    setTakePartId,
    isCurrentFirstQuestion,
    showReportForResponder,
    
        isDialogOpen,
    handleClose,
    handleConfirm,
    handleStartNew,
  } = useParticipateForm();

  if (firstLoading) return <ParticipateLoadingSkeleton />;

  if (limitation.isLimited && !limitationStepPassed) {
    return (
      <ResponsiveContainer>
        <FormLimitation
          type={limitation.limitationType}
          setLimitation={setLimitation}
          setQuestion={setQuestion}
          addQuestion={(data) => {
            setFormName(data.formName)
            setTakePartId(data.takePart)
            initializeQuestion(data);
            setLimitationStepPassed(true);
          }}
        />
      </ResponsiveContainer>
    );
  }

  if (finishPage) {
    return (
      <FinishStep
        question={question}
        showReportForResponder={showReportForResponder}
        takePartId={takePartId}
        formName={formName}
        replace={replace}
        formId={realFormID}
      />
    );
  }

  if (hasError.status) {
    return <ErrorStep message={hasError.message} replace={replace} />;
  }

  return (
    <QuestionStep
      question={question}
      formName={formName}
      formData={formData}
      ValidatedInput={ValidatedInput}
      handleValidationUpdate={handleValidationUpdate}
      handleNext={handleNext}
      handlePrev={handlePrev}
      prevBlock={isCurrentFirstQuestion}
      questionLoading={questionLoading}
      formId={realFormID}
      replace={replace}
    />
  );
}
