import { defineConfig } from "vitest/config"
import { fileURLToPath } from "node:url"

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    // Component tests import `@/sanity/image`, which asserts these at module
    // load. Dummy values: no test talks to Sanity, they just need the module to
    // finish importing (CI runs `npm test` with no environment of its own).
    env: {
      NEXT_PUBLIC_SANITY_PROJECT_ID: "test-project",
      NEXT_PUBLIC_SANITY_DATASET: "test",
    },
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
})
