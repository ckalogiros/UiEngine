module.exports = {

   // https://vite.dev/config/server-options.html
   server:{
      host:'localhost',
      port:6001,
      open: '/src/index.html',

      cors:true, //  Pass an options object to fine tune the behavior or true to allow any origin.
      // { origin: /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/ }
      // cors:{ origin: /^https?:\/\/(?:(?:[^:]+\.)?localhost|6001|\[::1\])(?::\d+)?$/ },

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
      host:'localhost',
      port:6001,
      open: '/src/index.html',
      cors:true,
   },
   // https://vite.dev/config/build-options.html
   buld:{

   },
};
 