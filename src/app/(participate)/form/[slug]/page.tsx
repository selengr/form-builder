'use client';

import React, { useState } from 'react';
import { useParticipateForm } from '@/hooks/useParticipateForm';
import Loading from '@/app/(builder)/preview/[id]/loading';
import ResponsiveContainer from '@/templates/form/ContentWrapper';
import FormLimitation from '@/templates/form/FormLimitation';
import { ErrorStep, FinishStep, QuestionStep } from './components';

export default function ParticipateFormPage({ params }: { params: { slug: string } }) {
  const [limitationStepPassed, setLimitationStepPassed] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const {
    firstLoading,
    questionLoading,
    finishPage,
    limitation,
    question,
    formData,
    formName,
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
    isCurrentFirstQuestion,
  } = useParticipateForm();

  if (firstLoading) return <LoadingScreen />;

  if (limitation.isLimited && !limitationStepPassed) {
    return (
      <ResponsiveContainer>
        <FormLimitation
          type={limitation.limitationType}
          setLimitation={setLimitation}
          setQuestion={setQuestion}
          addQuestion={(data) => {
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
        formName={formName}
        replace={replace}
        formId={realFormID}
        isReportDialogOpen={isReportDialogOpen}
        handleOpenReportDialog={() => setIsReportDialogOpen(true)}
        handleCloseReportDialog={() => setIsReportDialogOpen(false)}
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
      isReportDialogOpen={isReportDialogOpen}
      handleOpenReportDialog={() => setIsReportDialogOpen(true)}
      handleCloseReportDialog={() => setIsReportDialogOpen(false)}
      formId={realFormID}
      replace={replace}
    />
  );
}

function LoadingScreen() {
  return (
    <div className='w-full h-screen flex justify-center items-center bg-white'>
      <Loading />
    </div>
  );
}
