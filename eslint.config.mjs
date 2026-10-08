import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Build artifacts (huge minified bundles crash/OOM eslint):
    ".open-next/**",
    "dist/**",
    ".wrangler/**",
    ".vercel/**",
    // Standalone Cloudflare Workers with their own package.json and tsconfig.
    "workers/**",
    // Vendored pdfjs worker, copied verbatim from node_modules on postinstall.
    "public/pdf.worker.min.mjs",
    // One-off operational/migration utilities — not shipped code. They predate
    // the Lint CI gate and fail no-require-imports / no-explicit-any en masse;
    // linting them adds no safety to the deployed site.
    "scripts/**",
    // Bundled agent skill tooling (not app code):
    ".claude/**",
  ]),
  // The Sanity page-doc convention throughout the marketing app is `page: any`
  // (loose doc consumption). That predates the Lint CI gate; keep it visible as
  // a warning and ratchet to error once docs are typed.
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);

export default eslintConfig;
