import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import svgReact from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
		build: {
			outDir: "publish",
		},
		server: {
			port: 8888,
			hmr: true,
			host: "0.0.0.0",
			https: true,
		},
		plugins: [
			svgReact(),
			react(),
			legacy({
				targets: ["defaults", "not IE 11"],
			}),
		],
	});

