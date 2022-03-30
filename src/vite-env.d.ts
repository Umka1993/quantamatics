/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_ENV: string,
	readonly VITE_BASE_URL: string,
	readonly VITE_API_URL: string,
	readonly VITE_HUB_URL: string,
	readonly VITE_DATA_API_URL: string,
	readonly VITE_EXCEL_PLUGIN_DOWNLOAD_URL: string,
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

declare module 'services/pendoInitialize"';
