import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    // Ajout de la configuration pour eslint-plugin-react
    plugins: {
      react: pluginReact,
    },
    settings: {
      react: {
        version: 'detect', // Détecte automatiquement la version de React
      },
    },
  },
];
