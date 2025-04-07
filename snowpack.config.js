// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration
// https://www.snowpack.dev/reference/configuration#mount
// https://www.snowpack.dev/reference/configuration#buildoptionssourcemap


module.exports = {
  mount: {
    public: {url: '/', static: true, resolve: false},
    src: '/',
    resources: '/resources',
  },
  plugins: [  ],
  packageOptions: {
    source:"local",
    cache:"/.snowpack/cache",
  },
  devOptions: {
    port: 6001,
  },
  buildOptions: {
    // sourceMaps: true,
    sourcemap: false,
    // Try these variations:
    sourceMap: "inline", // or "external"
    minify: false, // Ensure false during dev
    clean:"true",
    cacheDirPath:"/node_modules/.cache/snowpack",
  }
};
