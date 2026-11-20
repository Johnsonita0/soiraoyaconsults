import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [isOnline, setIsOnline] = useState(() => typeof navigator === 'undefined' || navigator.onLine)
  const onlineRef = useRef(typeof navigator === 'undefined' || navigator.onLine)
  const offlineToastShownRef = useRef(false)

  const dismissToast = useCallback((id) => setToasts((current) => current.filter((toast) => toast.id !== id)), [])
  const showToast = useCallback((message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((current) => [...current, { id, message, type }])
    window.setTimeout(() => dismissToast(id), 4500)
  }, [dismissToast])

  const reportOffline = useCallback(() => {
    if (onlineRef.current) {
      onlineRef.current = false
      setIsOnline(false)
    }
    if (offlineToastShownRef.current) return
    offlineToastShownRef.current = true
    showToast('You are offline. Changes will not sync until the connection returns.', 'error')
  }, [showToast])

  const reportOnline = useCallback(() => {
    if (onlineRef.current) return
    onlineRef.current = true
    offlineToastShownRef.current = false
    setIsOnline(true)
    showToast('Connection restored. You are back online.', 'success')
  }, [showToast])

  useEffect(() => {
    window.addEventListener('offline', reportOffline)
    window.addEventListener('online', reportOnline)
    if (typeof navigator !== 'undefined' && !navigator.onLine) reportOffline()

    return () => {
      window.removeEventListener('offline', reportOffline)
      window.removeEventListener('online', reportOnline)
    }
  }, [reportOffline, reportOnline])

  return <ToastContext.Provider value={{ showToast, dismissToast, isOnline, reportOffline }}>
    {children}
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => <div className={`toast toast-${toast.type}`} key={toast.id} role="status"><span>{toast.type === 'success' ? '✓' : toast.type === 'error' ? '!' : 'i'}</span><p>{toast.message}</p><button type="button" onClick={() => dismissToast(toast.id)} aria-label="Dismiss notification">×</button></div>)}
    </div>
  </ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}
