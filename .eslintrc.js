module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'standard',
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:vue/strongly-recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['vue'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        singleAttributePerLine: true,
        semi: false,
        vueIndentScriptAndStyle: true,
      },
    ],
  },
}
