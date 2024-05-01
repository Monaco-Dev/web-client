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
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: ['vue'],
}
