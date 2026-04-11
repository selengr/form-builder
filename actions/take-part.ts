"use server"

import { serverApi } from "@/services/axios/serverApi"

export async function takePartAction(params: {
  slug: string
  username: string | null
  from?: string
  refId?: string
}) {
  try {
    const { slug, username, from, refId } = params
    const isLink = /^(public-|solo-|group-|survey-)/.test(slug)

    const res = await serverApi.post("/take-part", {
      link: isLink ? slug : null,
      formId: !isLink ? slug : null,
      username,
      from: from ?? "PUBLIC_PAGE",
      refId: refId ?? null,
    })

    return { data: res.data }
  } catch (error: any) {
    const message =
      error?.response?.data?.message?.[0]?.title ||
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      'خطای نامشخص';

    throw new Error(message);
  }
}

export async function checkResponseLimitationAction(params: {
  slug: string
}) {
  try {
    const { slug } = params
    const isLink = /^(public-|solo-|group-|survey-)/.test(slug)

    const res = await serverApi.post("/take-part/check-response-limitation-form", {
      link: isLink ? slug : null,
      id: !isLink ? slug : null,
    })

   return { data: res.data }
  } catch (error: any) {
    const message =
      error?.response?.data?.message?.[0]?.title ||
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      'خطای نامشخص';

    throw new Error(message);
  }
}

export async function checkAnswerBeforeAction(params: {
  slug: string
  username: string | null
  refId?: string
  from?: string
}) {
  try {
    const { slug, username, refId, from } = params
    const isLink = /^(public-|solo-|group-|survey-)/.test(slug)

    const res = await serverApi.post("/take-part/check-answer-to-form-before", {
        link: isLink ? slug : null,
        formId: !isLink ? slug : null,
        username,
        refId: refId ?? undefined,
        from: from ?? undefined,
    })

    return { data: res.data }
  } catch (error: any) {
    const message =
      error?.response?.data?.message?.[0]?.title ||
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      'خطای نامشخص';
console.log("-----------------------------------------------------------1",error?.response?.data?.message)
console.log("-----------------------------------------------------------2",error?.response?.data?.message)
console.log("-----------------------------------------------------------2", error?.message)
    throw new Error(message);
  }
}

export async function insertAnswerAction(params: {
  formId: string | number
  takePartId: any
  questionId: string | number
  answerList: Array<{
    optionId: number | null
    answer: string
    id?: number
  }>
}) {
  try {
    const { formId, takePartId, questionId, answerList } = params

    const res = await serverApi.post("/take-part/insert-answer", {
      formId,
      takePartId,
      questionId,
      answerList,
    })

    return res.data
  } catch (error: any) {
    const message =
      error?.response?.data?.message?.[0]?.title ||
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      'خطای نامشخص';

    throw new Error(message);
  }
}


export async function getPreviousQuestionAction(params: {
  takePartId: any
}) {
  try {
    const { takePartId } = params

    const res = await serverApi.post("/question/previous-question", {
      takePartId,
    })

    return { data: res.data }
  } catch (error: any) {
    const message =
      error?.response?.data?.message?.[0]?.title ||
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      'خطا در بازگشت به سوال قبلی';

    throw new Error(message);
  }
}
