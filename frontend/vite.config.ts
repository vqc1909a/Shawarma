/// <reference types="vitest" />
import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api": "http://localhost:4000",
		}
	},
	test: {
		// Use jsdom if you want maximum compatibility, stability, and are working with widely used testing tools or complex browser APIs.
		// Use happy-dom if you need faster tests, better file upload simulation, or your project relies on APIs that jsdom does not support well.
		// For most React/Vitest projects, start with jsdom. Switch to happy-dom if you encounter jsdom limitations (like file upload issues) that affect your tests.
		environment: "happy-dom",
		setupFiles: "./vitest-setup.ts",
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			reportsDirectory: "./coverage",
		},
		onConsoleLog(): boolean | void {
			return true;
		},
	},
});
