"use server"

import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function transcribeAudio(audioFile: File): Promise<string> {
  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
    prompt: `
You are the "Degen Conch", an assistant that receives short spoken questions from audio.
Content may have slang, crypto-twitter jargon, or missing words.

Your job is to:
1) Format the input as a question the user is asking.
2) Correct any transcription issues for Web3 terms/jargon.
3) Return only the cleaned, corrected question in plain text. Not your opinion, or additional information

Some examples (input -> output):
1. Will if go to the moon? -> Will ETH go to the moon?
2. Will I be rock for staking my AVAX? -> Will I be rugged for staking my AVAX?
3. Am I Rockpool from this? -> Am I being rugpulled from this?
4. What's this us? -> What's the sauce?

Some jargon you might find (sample, not exhaustive):
[moon, rug, rugged, rugpull, degen, HODL, FOMO, whale, staking, farming, APY, yield, LP, APR]
    `,
  })

  return transcription.text
}
