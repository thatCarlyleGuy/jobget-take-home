module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['jest', 'prettier', 'testing-library'],
  extends: [
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:@next/next/recommended',
  ],
  overrides: [
    // Only uses Testing Library lint rules in test files
    {
      files: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
  rules: {
    'prettier/prettier': ['error'],
    'react/react-in-jsx-scope': [0],
    // quotes: ["error", "double"],
  },
};
