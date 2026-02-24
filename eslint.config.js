import eslintPluginAstro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,

  {
    rules: {
      "no-console": "error",
    },
  },

  {
    ignores: ["dist/**", ".astro", "public/pagefind/**"],
  },
];