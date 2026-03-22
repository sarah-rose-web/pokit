import { create } from 'zustand'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './Toast.css'

/**
 * @typedef {{ id: string, message: string, type: 'success'|'error'|'info'|'warning' }} ToastItem
 */

/** Internal toast store — not exported from store/index, used only here */
const useToastStore = create((set) => ({
  /** @type {ToastItem[]} */
  toasts: [],

  /** @param {Omit<ToastItem, 'id'>} toast */
  add: (toast) => {
    const id = Math.random().toString(36).slice(2)
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 3500)
  },

  /** @param {string} id */
  remove: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

/**
 * Programmatic toast helper.
 * Usage: toast.success('Saved!') / toast.error('Oops')
 */
export const toast = {
  success: (message) => useToastStore.getState().add({ message, type: 'success' }),
  error:   (message) => useToastStore.getState().add({ message, type: 'error' }),
  info:    (message) => useToastStore.getState().add({ message, type: 'info' }),
  warning: (message) => useToastStore.getState().add({ message, type: 'warning' }),
}

const ICONS = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
}

/** Mount this once in App.jsx or index.html via a Portal */
export default function ToastContainer() {
  const { toasts, remove } = useToastStore()

  return createPortal(
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast--${t.type} toast-enter`}
          role="alert"
        >
          <span className="toast__icon">{ICONS[t.type]}</span>
          <span className="toast__message">{t.message}</span>
          <button
            className="toast__close"
            onClick={() => remove(t.id)}
            aria-label="Dismiss"
          >✕</button>
        </div>
      ))}
    </div>,
    document.body
  )
}
