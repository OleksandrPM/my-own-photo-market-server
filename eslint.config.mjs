// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  // 1) Global ignores
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },

  // 2) Core JS recommended rules
  eslint.configs.recommended,

  // 3) Node environment
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // 4) TypeScript + Prettier + project rules
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    extends: [...tseslint.configs.recommended, prettierRecommended],
    rules: {
      // Example tweaks, adjust to taste
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
);
