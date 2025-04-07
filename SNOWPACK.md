# snowpack

1. snowpack bundler
2. snowpack dev

* snowpack bundler: creates a build (minified if chosen) of the current project. 
   That way any npm dependency can be bandled to run in the browser

* snowpack dev: creates a local server for unbundled development. The dev server will build a file only when it’s requested by the browser.


# Command Line API
Commands
   snowpack init         Create a new project config file.
   snowpack dev          Develop your app locally.
   snowpack build        Build your app for production.


# Show helpful info
   $ snowpack --help

* Show additional debugging logs
   $ snowpack --verbose

* {devOptions: {open: 'none'}}
   $ snowpack dev --open none

* {buildOptions: {clean: true/false}}
   $ snowpack build --clean
   $ snowpack build --no-clean

CLI flags will be merged with (and take priority over) your config file values. Every config value outlined below can also be passed as a CLI flag. Additionally, Snowpack also supports the following flags:

   --config [path] Set the path to your project config file.
   --help Show this help.
   --version Show the current version.
   --reload Clear the local cache. Useful for troubleshooting installer issues.