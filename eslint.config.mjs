import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
    {
        ignores: ['dist/**', 'node_modules/**', 'eslint.config.mjs'],
    },

    js.configs.recommended,

    ...tseslint.configs.recommendedTypeChecked,

    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // "no-console": "off",
            'dot-notation': 'error',
        },
    },
]);
