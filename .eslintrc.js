module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    // 'eslint:recommended',
    // 'plugin:@typescript-eslint/eslint-recommended',
    // 'plugin:@typescript-eslint/recommended',
    // 'airbnb-typescript',
    // 'prettier/@typescript-eslint',
    // 'plugin:prettier/recommended',
  ],
  parserOptions: {
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'quotes': 'off',
    '@typescript-eslint/quotes': ['error', 'single'],
    '@typescript-eslint/no-use-before-define': 'error',
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': ['error'],
    'no-magic-numbers': 'off',
    '@typescript-eslint/no-magic-numbers': ['error', { ignore: [-1, 0, 1], ignoreNumericLiteralTypes: true, ignoreReadonlyClassProperties: true }],
    'indent': 'off',
    '@typescript-eslint/indent': ['error', 2],
    'func-call-spacing': 'off',
    '@typescript-eslint/func-call-spacing': ['error'],
    'brace-style': 'off',
    '@typescript-eslint/brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
    '@typescript-eslint/typedef': [ 'error', { 'arrowParameter': false }],
    '@typescript-eslint/type-annotation-spacing': 'error',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-as-const': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/no-empty-interface': 'error',
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/member-delimiter-style': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    // '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/prefer-includes': 'error',
    "space-before-function-paren": "off",
    "@typescript-eslint/space-before-function-paren": ["error", { "anonymous": "never", "named": "never", "asyncArrow": "always" }],
    "require-await": "off",
    "@typescript-eslint/require-await": "error",
    '@typescript-eslint/no-explicit-any': 'warn'
  },
};