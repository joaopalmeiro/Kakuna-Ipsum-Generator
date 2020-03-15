var { gulp, src, dest, watch, series, parallel } = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync");
var nodemon = require("gulp-nodemon");
var prefix = require("gulp-autoprefixer");
var rename = require("gulp-rename");
// var minify = require("gulp-cssnano");
var postcss = require("gulp-postcss"); // Minify
var header = require("gulp-header");
var jshint = require("gulp-jshint");
var package = require("./package.json");

var RELOAD_DELAY = 500;

var banner = {
  full:
    "/*!\n" +
    " * <%= package.name %> v<%= package.version %>\n" +
    " * <%= package.description %>\n" +
    " * (c) " +
    new Date().getFullYear() +
    " <%= package.author.name %>\n" +
    " * <%= package.license %> License\n" +
    " * <%= package.repository.url %>\n" +
    " */\n\n",
  min:
    "/*!" +
    " <%= package.name %> v<%= package.version %>" +
    " | (c) " +
    new Date().getFullYear() +
    " <%= package.author.name %>" +
    " | <%= package.license %> License" +
    " | <%= package.repository.url %>" +
    " */\n"
};

var lintScripts = function(done) {
  return src("*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"));
};

var buildStyles = function(done) {
  return src("style.scss")
    .pipe(
      sass({
        outputStyle: "expanded",
        sourceComments: true
      }).on("error", sass.logError)
    )
    .pipe(prefix())
    .pipe(header(banner.full, { package: package }))
    .pipe(dest("public"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss())
    .pipe(header(banner.min, { package: package }))
    .pipe(dest("public"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
};

var startNodemon = function(done) {
  var called = false;
  return nodemon({
    script: "app.js",
    watch: ["app.js"]
  })
    .on("start", function onStart() {
      if (!called) {
        done();
      }
      called = true;
    })
    .on("restart", function onRestart() {
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        });
      }, RELOAD_DELAY);
    });
};

var startServer = function(done) {
  browserSync.init(
    {
      proxy: "http://localhost:3000",
      port: 4000,
      browser: "chrome" // Just 'chrome' (instead of 'google-chrome' or 'google chrome') for Windows
    },
    done
  );

  // Signal completion
  done();
};

var reloadBrowser = function(done) {
  browserSync.reload();
  done();
};

var watchSource = function(done) {
  watch("*", series(exports.default, reloadBrowser));
  watch("public/*.html", reloadBrowser);
  done();
};

/**
 * Export Tasks
 */

// Default task
// gulp
exports.default = series(parallel(lintScripts, buildStyles));

// Watch and reload task
// gulp watch
exports.watch = series(exports.default, startNodemon, startServer, watchSource);
