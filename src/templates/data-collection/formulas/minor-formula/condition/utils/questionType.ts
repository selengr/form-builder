export const getQuestionField = (questionType?: string) => {
  if (!questionType) return '';
  const separatorIndex = questionType.indexOf('*');
  return separatorIndex === -1 ? questionType : questionType.slice(separatorIndex + 1);
};
