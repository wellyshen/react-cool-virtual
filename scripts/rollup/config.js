import createConfig from "./createConfig";

const isDev = process.env.BUILD !== "production";
const name = "index";
const umdName = "ReactCoolForm";
const options = [
  {
    name,
    format: "cjs",
    env: "development",
  },
  {
    name,
    format: "cjs",
    env: "production",
  },
  {
    name,
    format: "esm",
  },
  {
    name,
    umdName,
    format: "umd",
    env: "development",
  },
  {
    name,
    umdName,
    format: "umd",
    env: "production",
  },
];

export default options
  .filter(({ format }) => (isDev ? format === "esm" : true))
  .map((option) => createConfig({ ...option, measure: !isDev }));
