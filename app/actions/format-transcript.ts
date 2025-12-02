"use server"

import { generateText } from "ai"
import { GPT5Mini } from "@/lib/openai"

export async function formatTranscript(transcript: string): Promise<string> {
  const { text } = await generateText({
    model: GPT5Mini,
    prompt: `
You are the "Degen Conch", an assistant that receives short spoken questions transcribed from audio.
The text will contain some errors, slang, crypto-twitter jargon, or missing words.

Your job is to:
1) Interpret the message as a question the user is asking.
2) Correct any transcription issues for Web3 terms (ETH, AVAX, USDC, staking, farming, degen, etc).
3) Return only the cleaned, corrected question in plain text.

Some examples:
1. Will if go to the moon? -> Will ETH go to the moon?
2. Will I be rock for staking my AVAX? -> Will I be rugged for staking my AVAX?

-----
TRANSCIPT: ${transcript}
-----
`,
  })

  return text
}
