/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_POLYGON_API_KEY: string
    // add VITE_* vars here
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
