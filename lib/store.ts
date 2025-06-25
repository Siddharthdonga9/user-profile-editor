import { create } from "zustand"

interface ToastState {
  message: string
  type: "success" | "error" | "info"
  isVisible: boolean
}

interface AppState {
  toast: ToastState
  showToast: (message: string, type: "success" | "error" | "info") => void
  hideToast: () => void
}

export const useAppStore = create<AppState>((set) => ({
  toast: {
    message: "",
    type: "info",
    isVisible: false,
  },
  showToast: (message: string, type: "success" | "error" | "info") => {
    set({
      toast: {
        message,
        type,
        isVisible: true,
      },
    })
    setTimeout(() => {
      set((state) => ({
        toast: {
          ...state.toast,
          isVisible: false,
        },
      }))
    }, 3000)
  },
  hideToast: () =>
    set((state) => ({
      toast: {
        ...state.toast,
        isVisible: false,
      },
    })),
}))
