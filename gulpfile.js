'use strict';

const { src, dest, watch, series } = require('gulp');
const dartSass = require('sass');
const gulpSass = require('gulp-sass');
const sass = gulpSass(dartSass);
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const rename = require('gulp-rename');
const minifyjs = require('gulp-minify');
const browsersync = require('browser-sync').create();

// Sass Task
async function scssTask(){
  return src('./src/assets/styles/main.scss', { sourcemaps: false })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(rename(function (path) {
      return {
        dirname: path.dirname + "",
        basename: path.basename + ".min",
        extname: ".css"
      };
    }))
    .pipe(dest('./public/css', { sourcemaps: '.' }));
}

// JavaScript Task
async function jsTask(){
  return src('./src/assets/js/main.js', { sourcemaps: false })
    .pipe(minifyjs({
      noSource: true,
      ext:{
        min:'.min.js'
      }
    }))
    .pipe(dest('./public/js', { sourcemaps: '.' }));
}

// Browsersync Tasks
async function browsersyncServe(cb){
  browsersync.init({
    server: {
      baseDir: '.'
    }
  });
  cb();
}

async function browsersyncReload(cb){
  browsersync.reload();
  cb();
}

// Watch Task
async function watchTask(){
  watch('*.html', browsersyncReload);
  watch(['./src/assets/styles/**/*.scss', './src/assets/js/**/*.js'], series(scssTask, jsTask, browsersyncReload));
}

// Default Gulp task
exports.default = series(
  scssTask,
  jsTask,
  browsersyncServe,
  watchTask
);