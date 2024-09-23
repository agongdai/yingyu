// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  plugins: ['simple-import-sort', 'import'],
  extends: ['expo', 'prettier'],
  rules: {
    // this is for sorting WITHIN an import
    'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],
    // this is for sorting imports
    'import/order': [
      'error',
      {
        groups: [['external', 'builtin'], 'internal', ['sibling', 'parent'], 'index'],
        pathGroups: [
          {
            pattern: '@(react|react-native)',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@src/**',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['internal', 'react'],
        'newlines-between': 'never',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
};
