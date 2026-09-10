import { createContext, useContext, useEffect, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismissToast = (id) => setToasts((current) => current.filter((toast) => toast.id !== id))
  const showToast = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((current) => [...current, { id, message, type }])
    window.setTimeout(() => dismissToast(id), 4500)
  }

  useEffect(() => {
    const handleOffline = () => showToast('You are offline. Changes will not sync until the connection returns.', 'error')
    const handleOnline = () => showToast('Connection restored. You are back online.', 'success')

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)
    if (!navigator.onLine) handleOffline()

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  return <ToastContext.Provider value={{ showToast, dismissToast }}>
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
