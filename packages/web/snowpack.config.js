/** @type {import("snowpack").SnowpackUserConfig } */
const config = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: [
    '@snowpack/plugin-babel',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-typescript',
  ],
  optimize: {
    bundle: true,
    splitting: true,
    minify: true,
    treeshake: true,
    target: 'es2017',
  },
  routes: [
    /* Enable an SPA Fallback in development: */
    { match: 'routes', src: '.*', dest: '/index.html' },
  ],
  devOptions: {
    port: 3000,
    open: 'none',
  },
  buildOptions: {
    sourcemap: true,
  },
};

module.exports = config;
