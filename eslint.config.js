import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', 'playwright-report/**', 'test-results/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-recommended'],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      // Une zone qui défile sans élément focalisable doit l'être elle-même pour le clavier
      // (axe, scrollable-region-focusable) : c'est le rôle « region » nommé.
      'astro/jsx-a11y/no-noninteractive-tabindex': ['error', { roles: ['tabpanel', 'region'] }],
    },
  },
  {
    // Les îlots Preact (ADR-016) ne portent aucun texte en dur : tout passe par les
    // dictionnaires, conformément à FR-I18N-4. Un texte JSX contenant une lettre est refusé.
    files: ['src/**/*.tsx'],
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXText[value=/\\p{L}/u]',
          message: 'Texte en dur dans un îlot : passer par les dictionnaires (FR-I18N-4).',
        },
      ],
    },
  },
  {
    files: ['scripts/**/*.ts', 'config/**/*.mjs', '*.config.{js,mjs,ts}'],
    rules: { 'no-console': 'off' },
  },
);
