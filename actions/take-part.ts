"use server"
import { AxiosApi } from "@/services/axios/AxiosApi"

export async function takePartAction(params: { slug: string; username: string | null; from?: string }) {
  const { slug, username, from } = params
  const isLink = /^(public-|solo-|group-|survey-)/.test(slug)
  
  const res = await AxiosApi.post("/tae-part", {
    link: isLink ? slug : null,
    formId: !isLink ? slug : null,
    username,
    from: from ?? "PUBLIC_PAGE",
  })
  
  return res.data
}