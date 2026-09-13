export type PackagingInjectionBody = {
  position: number;
  targetFormId: number;
  selectedFormId: number;
};


export async function createQuestion(payload: any) {
  const { createQuestionAction } = await import('@actions/builder/question');
  return createQuestionAction(payload);
}

export async function updateQuestion(questionId: string, payload: any) {
  const { updateQuestionAction } = await import('@actions/builder/question');
  return updateQuestionAction(questionId, payload);
}

export async function createPackagingInjection(payload: PackagingInjectionBody) {
  const { createPackagingFormInjection } = await import('@actions/builder/question');
  return createPackagingFormInjection(payload);
}

export async function upsertStartPage(payload: any) {
  const { upsertStartPageAction } = await import('@actions/builder/formStartPage');
  return upsertStartPageAction(payload);
}

export async function createEndPage(payload: any) {
  const { createEndPageAction } = await import('@actions/builder/formEndPage');
  return createEndPageAction(payload);
}

export async function updateEndPage(payload: any) {
  const { updateEndPageAction } = await import('@actions/builder/formEndPage');
  return updateEndPageAction(payload);
}

export async function getForm(id: string) {
  const { getFormAction } = await import('@actions/builder/getFormAction');
  return getFormAction(id);
}
