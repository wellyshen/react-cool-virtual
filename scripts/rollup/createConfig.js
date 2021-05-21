import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import compiler from "@ampproject/rollup-plugin-closure-compiler";
import { terser } from "rollup-plugin-terser";

import pkg from "../../package.json";

const babelRuntimeVersion = pkg.dependencies["@babel/runtime"].replace(
  /^[^0-9]*/,
  ""
);

const makeExternalPredicate = (external) =>
  !external.length
    ? () => false
    : (id) => new RegExp(`^(${external.join("|")})($|/)`).test(id);

export default ({ name, umdName, input, format, env, measure }) => {
  const isUmd = format === "umd";
  const shouldMinify = env === "production";
  const extensions = [".ts"];
  const fileName = [name, format, env, shouldMinify ? "min" : "", "js"]
    .filter(Boolean)
    .join(".");

  return {
    input: input || "src",
    output: {
      file: `${pkg.files[0]}/${fileName}`,
      format,
      name: umdName,
      sourcemap: true,
      globals: { react: "React" },
      exports: "named",
    },
    plugins: [
      resolve({ extensions }),
      isUmd && commonjs(),
      babel({
        exclude: "node_modules/**",
        plugins: [
          [
            "@babel/plugin-transform-runtime",
            { version: babelRuntimeVersion, helpers: !isUmd },
          ],
        ],
        babelHelpers: isUmd ? "bundled" : "runtime",
        extensions,
      }),
      replace({
        __DEV__: 'process.env.NODE_ENV !== "production"',
        ...(env ? { "process.env.NODE_ENV": JSON.stringify(env) } : {}),
      }),
      measure && sizeSnapshot(),
      shouldMinify &&
        compiler({
          formatting: "PRETTY_PRINT",
          compilation_level: "SIMPLE_OPTIMIZATIONS",
        }),
      shouldMinify &&
        terser({
          output: { comments: false },
          compress: { drop_console: true },
        }),
    ].filter(Boolean),
    external: makeExternalPredicate([
      ...Object.keys(pkg.peerDependencies),
      ...(isUmd ? [] : Object.keys(pkg.dependencies)),
    ]),
  };
};
