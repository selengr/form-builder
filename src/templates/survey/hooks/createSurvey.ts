import { useMutation } from '@tanstack/react-query';
import { SurveyFormSchemaType } from '../CreateSurveyBtn';

export async function createSurvey(
    data: SurveyFormSchemaType
): Promise<{ id: string }> {
    const res = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
        let errorMessage = 'خطا در ثبت گروه.';

        if (Array.isArray(result?.error) && result.error[0]?.title) {
            errorMessage = result.error[0].title;
        } else if (typeof result?.error === 'string') {
            errorMessage = result.error;
        }

        throw new Error(errorMessage);
    }

    return result;
}

export function useCreateSurvey() {
    return useMutation({
        mutationFn: createSurvey,
    });
}
