module.exports = {
    "env": {
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "App": true,
        "Page": true,
        "wx": true,
        "getApp": true,
        "module": true,
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
    },
    "rules": {
        "semi": ["error", "always"],
        "no-unused-vars": "warn",
        "arrow-parens": "error"
    }
};
