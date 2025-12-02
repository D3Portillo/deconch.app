"use client"

import { useEffect, useRef, useState } from "react"
import { pipeline } from "@xenova/transformers"

export default function Home() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const transcriberRef = useRef<any>(null)

  useEffect(() => {
    // Load Whisper model on mount
    pipeline("automatic-speech-recognition", "Xenova/whisper-tiny.en").then(
      (transcriber) => {
        transcriberRef.current = transcriber
      }
    )
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        })
        stream.getTracks().forEach((track) => track.stop())
        await transcribeAudio(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error("Error accessing microphone:", err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    if (!transcriberRef.current) {
      setTranscript("Model still loading...")
      return
    }

    setIsLoading(true)
    try {
      const arrayBuffer = await audioBlob.arrayBuffer()
      const audioContext = new AudioContext({ sampleRate: 16000 })
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      const audioData = audioBuffer.getChannelData(0)

      const result = await transcriberRef.current(audioData)
      setTranscript(result.text)
    } catch (err) {
      console.error("Transcription error:", err)
      setTranscript("Error transcribing audio")
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
                ? "bg-linear-to-br from-dc-blue via-purple-500 to-dc-pink scale-110 shadow-2xl"
                : "bg-linear-to-br from-dc-blue via-purple-600 to-dc-pink hover:scale-105 shadow-lg"
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
            className={`
            w-20 h-20 rounded-full bg-white/90
            transition-all duration-300
            ${isRecording ? "scale-75" : "scale-100"}
          `}
          />
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            {isRecording ? "🎤 Recording..." : "Press and hold to speak"}
          </p>
          {isLoading && (
            <p className="text-sm text-gray-500">Transcribing...</p>
          )}
        </div>

        {transcript && (
          <div className="max-w-md p-4 bg-white rounded-lg shadow-md border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Transcript:
            </p>
            <p className="text-gray-900">{transcript}</p>
          </div>
        )}
      </div>
    </main>
  )
}
