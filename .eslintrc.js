// https://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  extends: 'plugin:vue/recommended',
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
  },
  globals: {
    Set: true,
    Promise: true,
  },
  // required to lint *.vue files
  plugins: [
    'html',
  ],
  // add your custom rules here
  'rules': {
    'brace-style': ['error', 'stroustrup'],
    'arrow-body-style': ['error', 'always'],
    'no-console': ['warn'],
    'no-debugger': ['warn'],
    'vue/html-self-closing': [
      'warn',
      {
        'html': {
          'void': 'always',
          'normal': 'always',
          'component': 'always',
      },
      'svg': 'always',
      'math': 'always',
      },
    ],
  }
};
