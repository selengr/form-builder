"use server"

import { AxiosApi } from "@/services/axios/AxiosApi"

export async function takePartAction(params: {
  slug: string
  username: string | null
  from?: string
}) {
  try {
    const { slug, username, from } = params
    const isLink = /^(public-|solo-|group-|survey-)/.test(slug)

    const res = await AxiosApi.post("/take-part", {
      link: isLink ? slug : null,
      formId: !isLink ? slug : null,
      username,
      from: from ?? "PUBLIC_PAGE",
    })

    return {
      success: true,
      data: res.data,
    }
  } catch (e: any) {
    console.error("Error in takePartAction:", e)
    return {
      success: false,
      error: e?.response?.data?.message || "An error occurred",
    }
  }
}

export async function checkResponseLimitationAction(params: {
  slug: string
}) {
  try {
    const { slug } = params
    const isLink = /^(public-|solo-|group-|survey-)/.test(slug)

    const res = await AxiosApi.post("/take-part/check-response-limitation-form", {
      link: isLink ? slug : null,
      id: !isLink ? slug : null,
    })

    return {
      success: true,    
      data: res.data,
    }
  } catch (e: any) {
    return {
      success: false,
      error: e?.response?.data?.message || "An error occurred",
      statusCode: e?.response?.status,
    }
  }
}

export async function checkAnswerBeforeAction(params: {
  slug: string
  username: string | null
}) {
  try {
    const { slug, username } = params
    const isLink = /^(public-|solo-|group-|survey-)/.test(slug)

    const res = await AxiosApi.post("/take-part/check-answer-to-form-before", {
      link: isLink ? slug : null,
      formId: !isLink ? slug : null,
      username,
    })

    return {
      success: true,
      data: {
        takePart: res.data.takePart,
        questionModel: res.data.questionModel,
        userAnswerModel: res.data.userAnswerModel,
      },
    }
  } catch (e: any) {
    console.error("Error in checkAnswerBeforeAction:", e)
    return {
      success: false,
      error: e?.response?.data?.message || "An error occurred",
    }
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

    const res = await AxiosApi.post("/take-part/insert-answer", {
      formId,
      takePartId,
      questionId,
      answerList,
    })

    return {
      success: true,
      data: res.data,
    }
  } catch (e: any) {
    return {
      success: false,
      error: e?.response?.data?.message || "An error occurred",
    }
  }
}

export async function getPreviousQuestionAction(params: {
  takePartId: any
}) {
  try {
    const { takePartId } = params

    const res = await AxiosApi.post("/question/previous-question", {
      takePartId,
    })

    return {
      success: true,
      data: {
        questionModel: res.data.questionModel,
        oldAnswers: res.data.oldAnswers,
      },
    }
  } catch (e: any) {
    console.error("Error in getPreviousQuestionAction:", e)
    return {
      success: false,
      error: e?.response?.data?.message || "An error occurred",
    }
  }
}
