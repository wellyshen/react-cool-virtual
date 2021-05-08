module.exports = {
  extends: ["welly"],
  rules: {
    "no-console": [
      "warn",
      {
        allow: ["warn", "error"],
      },
    ],
    "no-bitwise": "off",
    "no-param-reassign": "off",
    "no-underscore-dangle": "off",
    "react/react-in-jsx-scope": "off",
  },
};
