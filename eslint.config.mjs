// eslint.config.mjs
import { FlatCompat } from "@eslint/eslintrc";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";

// Create a FlatCompat instance to support legacy "extends" syntax.
const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    // Plugins in legacy format must be an array of plugin names.
    plugins: ["react-hooks"],
    rules: {
      // Disable react-in-jsx-scope (not needed in React 17+)
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off",
      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  }),
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
      ],
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^node:"],
            ["^react($|/)", "^next($|/)"],
            ["^@?\\w"],
            ["^types$", "^@/types(/.*|$)"],
            ["^@/config(/.*|$)"],
            ["^@/lib(/.*|$)"],
            ["^@/hooks(/.*|$)"],
            ["^@/providers(/.*|$)"],
            ["^@/services(/.*|$)"],
            ["^@/components/ui(/.*|$)"],
            ["^@/components(/.*|$)"],
            ["^@/app(/.*|$)"],
            ["^[./]"],
            ["^@/styles(/.*|$)"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "prisma/**"],
  },
];

export default eslintConfig;
