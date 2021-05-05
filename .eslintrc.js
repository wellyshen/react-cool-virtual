module.exports = {
  extends: ["welly"],
  rules: {
    "no-console": [
      "warn",
      {
        allow: ["warn", "error"],
      },
    ],
    "no-param-reassign": "off",
    "react/react-in-jsx-scope": "off",
  },
};
