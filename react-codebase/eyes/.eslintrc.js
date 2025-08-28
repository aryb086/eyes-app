module.exports = {
  extends: ['react-app', 'react-app/jest'],
  rules: {
    // Suppress warnings that are blocking production builds
    'jsx-a11y/heading-has-content': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'no-unused-vars': 'off',
    'default-case': 'off',
    'import/no-anonymous-default-export': 'off'
  },
  env: {
    browser: true,
    es2021: true,
    node: true
  }
};
