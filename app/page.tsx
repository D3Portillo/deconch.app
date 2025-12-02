"use client"

import { useRef, useState } from "react"
import { transcribeAudio } from "@/app/actions/transcribe"
import { generateSpeech } from "@/app/actions/generate-speech"

export default function Home() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [answer, setAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const recorder = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })

      const audioChunks: Array<Blob> = []

      mediaRecorder.ondataavailable = (e) => {
        audioChunks.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        await handleTranscription(
          new File(audioChunks, "audio.webm", { type: "audio/webm" })
        )
      }

      mediaRecorder.start()
      setIsRecording(true)

      recorder.current = mediaRecorder
    } catch (err) {
      console.error(err)
    }
  }

  const stopRecording = () => {
    if (recorder.current && isRecording) {
      recorder.current.stop()
      setIsRecording(false)
    }
  }

  const handleTranscription = async (file: File) => {
    setIsLoading(true)

    try {
      const transcriptText = await transcribeAudio(file)
      setTranscript(transcriptText)

      // Random YES/NO
      const response = Math.random() > 0.5 ? "YES" : "NO"

      setAnswer(response)

      // Generate speech
      const audioBuffer = await generateSpeech(response)
      const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" })
      const audioUrl = URL.createObjectURL(audioBlob)

      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
      }
    } catch (error) {
      console.error({ error })
      setTranscript("Error transcribing")
    }

    setIsLoading(false)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center gap-8">
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`
            w-32 h-32 rounded-full
            transition-all duration-300 ease-out
            ${
              isRecording
                ? "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 scale-110 shadow-2xl"
                : "bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 hover:scale-105 shadow-lg"
            }
            active:scale-95
            flex items-center justify-center
            relative overflow-hidden
          `}
        >
          {isRecording && (
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
          )}
          <div
            className={`w-20 h-20 rounded-full bg-white/90 transition-all duration-300 ${
              isRecording ? "scale-75" : "scale-100"
            }`}
          />
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            {isRecording ? "🎤 Recording..." : "Press and hold to speak"}
          </p>
          {isLoading && <p className="text-sm text-gray-500">Transcribing…</p>}
        </div>

        {transcript && (
          <div className="max-w-md w-full space-y-4">
            <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">
                You asked:
              </p>
              <p className="text-gray-900">{transcript}</p>
            </div>

            {answer && (
              <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-md border border-purple-200">
                <p className="text-sm font-medium text-purple-700 mb-2">
                  🐚 The Conch says:
                </p>
                <p className="text-lg font-bold text-purple-900">{answer}</p>
              </div>
            )}
          </div>
        )}

        <audio ref={audioRef} className="hidden" />
      </div>
    </main>
  )
}
