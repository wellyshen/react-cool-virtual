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
    "react/react-in-jsx-scope": "off",
  },
};
