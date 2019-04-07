
const { src, dest, parallel } = require('gulp');
const rename = require("gulp-rename");
const { plugin } = require("../index");

function fileSystem() {
  return src('./input/Service.js')
    .pipe(plugin())
    .pipe(rename((path) => {
      path.extname = '.svg';
    }))
    .pipe(dest('./output/'));
}

function Service() {
  return src('./input/fileSystem.js')
    .pipe(plugin())
    .pipe(rename((path) => {
      path.extname = '.svg';
    }))
    .pipe(dest('./output/'));
}

exports.fileSystem = fileSystem;
exports.Service = Service;
exports.default = parallel(fileSystem, Service);
