export default {

   // https://vite.dev/config/server-options.html
   server:{
      // host:'localhost:6001',
      host:'localhost',
      port:6001,
      // open: './src/scripts/entry.js',
      // open: './src/index.html',
      open: './src/',
      // open: 'http://localhost:6001/',

      cors:true, //  Pass an options object to fine tune the behavior or true to allow any origin.
      // { origin: /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/ }
      // cors:{ origin: /^https?:\/\/(?:(?:[^:]+\.)?localhost|6001|\[::1\])(?::\d+)?$/ },

      // origin: 'http://localhost:6001',
      // server: { origin: 'http://127.0.0.1:8080', },
      // origin:  

      // sourcemapIgnoreList:
      // As a functio
      // sourcemapIgnoreList(sourcePath, sourcemapPath) {
      //    return sourcePath.includes('node_modules')
      //  },
   },
   // https://vite.dev/config/preview-options.html
   preview:{
      // host:'localhost',
      // port:6001,
      // open: '/src/index.html',
      // cors:true,
      // URL:'http://localhost:6001/',
   },
   // https://vite.dev/config/build-options.html
   buld:{

   },
};
 