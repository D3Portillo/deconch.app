"use client"

import { useEffect, type PropsWithChildren } from "react"
import { useDeviceSafeInsetBottom } from "@/hooks/window"

export default function SafeInsetProvider({ children }: PropsWithChildren) {
  const { safeInsetBottom } = useDeviceSafeInsetBottom()

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--safe-inset-bottom",
      `${safeInsetBottom}px`
    )
  }, [safeInsetBottom])

  return children
}
