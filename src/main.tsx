import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from '@/components/ui/sonner.tsx'
import { LoaderProvider } from './context/loader/LoaderProvider.tsx'
import { Provider } from 'react-redux'
import store from '@/lib/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <LoaderProvider>
        <App />
        <Toaster />
      </LoaderProvider>
    </Provider>
  </StrictMode>,
)
