import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from '@/components/ui/sonner.tsx'
import { AuthProvider } from '@/context/auth/AuthProvider.tsx'
import { LoaderProvider } from './context/loader.tsx/LoaderProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoaderProvider>
      <App />
      <Toaster />
    </LoaderProvider>
  </StrictMode>,
)
