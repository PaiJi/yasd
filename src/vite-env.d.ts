/// <reference types="vite-plus/client" />

interface ImportMetaEnv {
  readonly VITE_HASH_ROUTER?: string
  readonly VITE_HOST?: string
  readonly VITE_PORT?: string
  readonly VITE_PROFILE?: string
  readonly VITE_PROTOCOL?: string
  readonly VITE_RUN_IN_SURGE?: string
  readonly VITE_URL_PATH_PREFIX?: string
  readonly VITE_USE_SW?: string
  readonly VITE_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
