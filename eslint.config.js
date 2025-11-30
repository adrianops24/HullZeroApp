import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'scripts/',
      'node_modules/',
      '.expo/',
      'dist/',
      'android/',
      'ios/',
      'web-build/',
      '*.p8',
      '*.jks',
      '*.p12',
      '*.key'
    ]
  },

  js.configs.recommended,

  {
    files: ['*.config.js', 'metro.config.js', 'babel.config.js', 'tailwind.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        module: true,
        require: true,
        __dirname: true,
        process: true
      }
    }
  },

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      },
      globals: {
        React: true,
        process: true
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-unused-vars': 'warn',
      'no-undef': 'off'
    }
  },

  prettier
];
