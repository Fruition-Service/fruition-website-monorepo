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
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    // `src/sanity/env.ts` throws at import time without these. They are the
    // public project coordinates (the same pair `scripts/sanity-client.ts`
    // hardcodes), not secrets — they just need to exist before the import.
    env: {
      NEXT_PUBLIC_SANITY_PROJECT_ID: "bt6nb58h",
      NEXT_PUBLIC_SANITY_DATASET: "production",
    },
  },
})
