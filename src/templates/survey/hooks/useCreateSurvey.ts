import { useMutation } from '@tanstack/react-query';
import { createSurveyAction } from '@actions/survey/createSurveyAction';
import { SurveyFormSchemaType } from '../CreateSurveyModal';

export async function createSurvey(data: SurveyFormSchemaType) {
  const res = await createSurveyAction({
    name: data.name,
    surveyTargetPlatformEnum: data.surveyTargetPlatformEnum,
    surveyPurposeEnum: data.surveyPurposeEnum,
  });

  if (!res.success) {
    throw new Error(res.message || 'خطا در ثبت گروه.');
  }

  return res.data;
}

export function useCreateSurvey() {
  return useMutation({
    mutationFn: createSurvey,
  });
}
