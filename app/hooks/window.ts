"use client"

import { MiniKit } from "@worldcoin/minikit-js"
import { useEffect, useState } from "react"

export const useDeviceSafeInsetBottom = () => {
  const [safeInsetBottom, setSafeInsetBottom] = useState(0)

  useEffect(() => {
    setSafeInsetBottom(MiniKit.deviceProperties.safeAreaInsets?.bottom || 0)
  }, [])

  return {
    safeInsetBottom,
  }
}
