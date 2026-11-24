/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_API_URL?: string;
  readonly VITE_APP_ENABLE_API_MOCKING?: 'true' | 'false';
  readonly VITE_APP_DEFAULT_LOCALE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
