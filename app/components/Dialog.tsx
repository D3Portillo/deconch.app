"use client"

import { useState, type ReactNode } from "react"
import {
  Dialog as DialogRoot,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export type DialogProps = {
  trigger?: ReactNode
  title?: ReactNode
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

export default function Dialog({
  trigger,
  title,
  children,
  open,
  onOpenChange,
  className,
}: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)

  // Use controlled state if provided, otherwise use internal state
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  function handleOpenChange(newOpen: boolean) {
    if (!isControlled) setInternalOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={handleOpenChange}>
      {trigger ? (
        <DialogTrigger onClick={() => handleOpenChange(!isOpen)} asChild>
          {trigger}
        </DialogTrigger>
      ) : null}
      <DialogContent className={cn("pt-7", className)}>
        {title ? <DialogTitle>{title}</DialogTitle> : null}
        <section className="mt-3">{children}</section>
      </DialogContent>
    </DialogRoot>
  )
}
