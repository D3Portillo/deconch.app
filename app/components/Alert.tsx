"use client"

import { atom, useAtom } from "jotai"
import Dialog from "@/components/Dialog"

const modalState = atom({
  isOpen: false,
  title: "",
  description: "",
})

export const useAlertModal = () => {
  const [, setState] = useAtom(modalState)

  const showAlert = ({
    title,
    description,
  }: {
    title: string
    description: string
  }) => setState({ isOpen: true, title, description })

  return { showAlert }
}

export function AlertProvider() {
  const [state, setState] = useAtom(modalState)

  return (
    <Dialog
      open={state.isOpen}
      title={state.title}
      onOpenChange={(isOpen) => setState((prev) => ({ ...prev, isOpen }))}
    >
      <p className="text-sm">{state.description}</p>

      <button
        onClick={() => setState((prev) => ({ ...prev, isOpen: false }))}
        className="mt-7 bg-white text-black px-5 py-2 rounded-xl font-semibold hover:bg-white/90 transition"
      >
        CLOSE
      </button>
    </Dialog>
  )
}
