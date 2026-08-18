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
    // Google Apps Script source. Runs in Google's runtime, not in this app —
    // its entry points (doGet/doPost) are called by the platform, so every
    // export reads as unused here.
    "scripts/apps-script.template.js",
  ]),
  {
    // The admin panel navigates with plain <a> on purpose. Every page under
    // /admin is force-dynamic and reads live data; a client-side <Link>
    // transition can serve it from the router cache, so a full document load
    // is the correct behaviour rather than an oversight.
    files: ["src/app/admin/**/*.{ts,tsx}"],
    rules: { "@next/next/no-html-link-for-pages": "off" },
  },
]);

export default eslintConfig;
