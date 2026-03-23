// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    ignores: ['dist'],
  },

  // JS rules only — no TS parser here
  {
    ...eslint.configs.recommended,
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
  },

  // Non-type-aware TS rules
  {
    ...tseslint.configs.recommended[0],
    files: ['src/**/*.ts'],
  },

  // Type-aware TS rules (the part that needs tsconfigRootDir)
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
