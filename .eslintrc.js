module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['airbnb-typescript'],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    'linebreak-style': ['off' ],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'arrow-body-style': ['off'],
    'react/destructuring-assignment': ['off'],
    "no-plusplus": "off",
    "import/prefer-default-export": "off",
    "class-methods-use-this": "off",
    "@typescript-eslint/no-unused-vars": ["warn"],
    "react/prefer-stateless-function": "off",
    "react/prop-types": "off",
    "unicode-bom": "off",
    "react/static-property-placement": ["off"],
  }
};
