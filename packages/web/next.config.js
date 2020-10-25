const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer({
  env: {
    NEXT_PUBLIC_FIREBASE_APP_CONFIG:
      process.env.NEXT_PUBLIC_FIREBASE_APP_CONFIG,
  },
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
