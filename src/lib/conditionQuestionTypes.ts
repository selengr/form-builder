export const INFO_DUMMY_OPERATOR = 'TEXT';
export const INFO_DUMMY_CONDITION = '#startWithText';
export const INFO_DUMMY_VALUE = '---';

export const MEDIA_DUMMY_OPERATOR = 'TEXT';
export const MEDIA_DUMMY_CONDITION = '#lenGreaterThanText';
export const MEDIA_DUMMY_VALUE = '0';

export const getQuestionTypeKey = (questionType?: string) => questionType?.split('*')[0] ?? '';

export const isMediaUploadQuestion = (questionType?: string) => {
  const key = getQuestionTypeKey(questionType);
  return key === 'IMAGE_UPLOAD' || key === 'AUDIO_UPLOAD';
};

export const isInfoFieldQuestion = (questionType?: string) => getQuestionTypeKey(questionType) === 'INFO_FIELD';

export const isInfoLikeQuestion = (questionType?: string) =>
  isInfoFieldQuestion(questionType) || isMediaUploadQuestion(questionType);

export const getDisabledConditionDefaults = (questionType?: string) => {
  if (isMediaUploadQuestion(questionType)) {
    return {
      operatorType: MEDIA_DUMMY_OPERATOR,
      conditionType: MEDIA_DUMMY_CONDITION,
      value: MEDIA_DUMMY_VALUE,
    };
  }

  return {
    operatorType: INFO_DUMMY_OPERATOR,
    conditionType: INFO_DUMMY_CONDITION,
    value: INFO_DUMMY_VALUE,
  };
};
