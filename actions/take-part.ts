"use server";

import { api } from "@/services/axios/actionWapper";

const PUBLIC_SLUG_REGEX = /^(public-|solo-|group-|survey-)/;

function isPublicSlug(slug: string) {
  return PUBLIC_SLUG_REGEX.test(slug);
}

export async function takePartAction(params: {
  slug: string;
  username: string | null;
  from?: string;
  refId?: string;
}) {
  const { slug, username, from, refId } = params;
  const isLink = isPublicSlug(slug);

  return api.post("/take-part", {
    link: isLink ? slug : null,
    formId: !isLink ? slug : null,
    username,
    from: from ?? "PUBLIC_PAGE",
    refId: refId ?? null,
  });
}

export async function checkResponseLimitationAction(params: {
  slug: string;
}) {
  const { slug } = params;
  const isLink = isPublicSlug(slug);

  return api.post("/take-part/check-response-limitation-form", {
    link: isLink ? slug : null,
    id: !isLink ? slug : null,
  });
}

export async function checkAnswerBeforeAction(params: {
  slug: string;
  username: string | null;
  refId?: string;
  from?: string;
}) {
  const { slug, username, refId, from } = params;
  const isLink = isPublicSlug(slug);

  const payload: any = {
    link: isLink ? slug : null,
    formId: !isLink ? slug : null,
    username,
  };

  if (refId) payload.refId = refId;
  if (from) payload.from = from;

  return api.post("/take-part/check-answer-to-form-before", payload);
}

export async function insertAnswerAction(params: {
  formId: string | number;
  takePartId: any;
  questionId: string | number;
  answerList: Array<{
    optionId: number | null;
    answer: string;
    id?: number;
  }>;
}) {
  const { formId, takePartId, questionId, answerList } = params;

  return api.post("/take-part/insert-answer", {
    formId,
    takePartId,
    questionId,
    answerList,
  });
}

export async function getPreviousQuestionAction(params: {
  takePartId: any;
}) {
  const { takePartId } = params;

  return api.post("/question/previous-question", {
    takePartId,
  });
}
