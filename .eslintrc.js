// https://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  extends: 'eslint:recommended',
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
  },
  globals: {
    Set: true,
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
  }
}
