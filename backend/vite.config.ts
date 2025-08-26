/// <reference types="vitest" />
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  test: {
    // Use jsdom for maximum compatibility and realism; use happy-dom for faster, simpler tests where full browser accuracy is not required.
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: './coverage'
    }
  }
})