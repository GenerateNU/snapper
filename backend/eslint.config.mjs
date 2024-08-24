import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        parser: typescriptParser,
        plugins: [typescriptEslint],
        extends: ['plugin:@typescript-eslint/recommended'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off'
        }
    }
];
