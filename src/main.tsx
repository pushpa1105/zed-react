import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { Toaster } from '@/shared/components/ui/sonner.tsx';
import { LoaderProvider } from '@/shared/context/loader';

import store from '@/app/store/index.ts';

import App from './App.tsx';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <LoaderProvider>
        <App />
        <Toaster />
      </LoaderProvider>
    </Provider>
  </StrictMode>
);
