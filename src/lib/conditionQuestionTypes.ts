export const INFO_LIKE_DUMMY_OPERATOR = 'TEXT';
export const INFO_LIKE_DUMMY_CONDITION = '#startWithText';
export const INFO_LIKE_DUMMY_VALUE = '---';

export const getQuestionTypeKey = (questionType?: string) => questionType?.split('*')[0] ?? '';

export const isMediaUploadQuestion = (questionType?: string) => {
  const key = getQuestionTypeKey(questionType);
  return key === 'IMAGE_UPLOAD' || key === 'AUDIO_UPLOAD';
};

export const isInfoLikeQuestion = (questionType?: string) =>
  getQuestionTypeKey(questionType) === 'INFO_FIELD' || isMediaUploadQuestion(questionType);
