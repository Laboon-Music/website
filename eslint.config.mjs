import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Formatting is Prettier's job: turn off ESLint rules that could conflict.
  prettier,
  // ImageResponse renders plain HTML: next/image cannot work there. The plugin already skips these files, but only on
  // Linux (it converts a single path separator, so the check misses on Windows): say it here, not with an inline
  // directive that CI then reports as unused.
  {
    files: ["app/**/opengraph-image.tsx", "app/**/twitter-image.tsx", "app/**/icon.tsx"],
    rules: { "@next/next/no-img-element": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated reports.
    "coverage/**",
  ]),
]);

export default eslintConfig;
