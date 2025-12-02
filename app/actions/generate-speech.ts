"use server"

import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateSpeech(input: string): Promise<ArrayBuffer> {
  const mp3 = await openai.audio.speech.create({
    input,
    model: "gpt-4o-mini-tts",
    voice: "alloy",
  })

  const buffer = await mp3.arrayBuffer()
  return buffer
}
