import { createOpenAI } from "@ai-sdk/openai"

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export const GPT5Mini = openai("gpt-5-mini")
