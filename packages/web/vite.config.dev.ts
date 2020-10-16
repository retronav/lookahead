import refresh from "vite-plugin-react";
import { UserConfig } from "vite";
const config: UserConfig = {
  jsx: "react",
  plugins: [refresh],
  optimizeDeps: {
    exclude: ["firebase"],
  },
};
module.exports = config;
