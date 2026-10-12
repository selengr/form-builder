export const REF_ID_QUESTION_TYPE = 'REF_ID';
export const REF_ID_OPERATOR_TYPE = 'REF_ID';
export const REF_ID_CONDITION_TYPE = '#matchRefId';

export const getQuestionTypeKey = (questionType?: string) => questionType?.split('*')[0] ?? '';

export const isRefIdQuestion = (questionType?: string) => getQuestionTypeKey(questionType) === REF_ID_QUESTION_TYPE;

export const getQuestionField = (questionType?: string) => {
  if (!questionType) return '';
  const separatorIndex = questionType.indexOf('*');
  return separatorIndex === -1 ? questionType : questionType.slice(separatorIndex + 1);
};
