const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer({
  trailingSlash: true,
  sassLoaderOptions: {
    outputStyle: "compressed",
  },
  webpack: (config, options) => {
    if (!options.dev) {
      config.devtool = "source-map";
      config.optimization.minimize = true;
    }
    return config;
  },
});
