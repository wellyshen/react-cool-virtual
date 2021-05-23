"use strict";

module.exports =
  process.env.NODE_ENV === "production"
    ? require("./index.cjs.production.min.js")
    : require("./index.cjs.development.js");
