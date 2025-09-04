import js from "@eslint/js"
import stylistic from "@stylistic/eslint-plugin"
import { defineConfig } from "eslint/config"
import globals from "globals"

export default defineConfig([
  stylistic.configs.recommended,
  { files: ["/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["/*.{js,mjs,cjs}"], languageOptions: { globals: globals.node } },
]);
