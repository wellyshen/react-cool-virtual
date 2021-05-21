import createConfig from "./createConfig";

const isDev = process.env.BUILD !== "production";
const name = "index";
const umdName = "ReactCoolVirtual";
const options = [
  {
    name,
    inputFile: "index.ts",
    format: "cjs",
    env: "development",
  },
  {
    name,
    inputFile: "index.ts",
    format: "cjs",
    env: "production",
  },
  {
    name,
    inputFile: "index.ts",
    format: "esm",
  },
  {
    name,
    umdName,
    inputFile: "index.umd.ts",
    format: "umd",
    env: "development",
  },
  {
    name,
    umdName,
    inputFile: "index.umd.ts",
    format: "umd",
    env: "production",
  },
];

export default options
  .filter(({ format }) => (isDev ? format === "esm" : true))
  .map((option) => createConfig({ ...option, measure: !isDev }));
