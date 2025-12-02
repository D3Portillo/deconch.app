"use client"

import { type PropsWithChildren, useEffect } from "react"
import { isDevEnv } from "@/lib/env"

export function initializeEruda() {
  // Already initialized
  if ((window as any).eruda) return
  require("eruda").init()
}

export default function ErudaProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    // Show on local env
    if (isDevEnv()) initializeEruda()
  }, [])

  return children
}
