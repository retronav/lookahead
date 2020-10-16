// import visualizer from "rollup-plugin-visualizer";
import { UserConfig } from "vite";
const config: UserConfig = {
  jsx: "react",
  alias: {
    react: "@pika/react",
    "react-dom": "@pika/react-dom",
  },
  esbuildTarget: "es6",
  minify: "esbuild",
  shouldPreload: (chunk) => chunk.fileName.includes("AccountPopover"),
  rollupInputOptions: {
    plugins: [
      // visualizer(),
    ],
  },
};
module.exports = config;
