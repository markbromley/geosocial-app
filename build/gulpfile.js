var gulp  = require("gulp"),
    gutil = require("gulp-util"),
    jshint = require("gulp-jshint"),
    shell = require("gulp-shell"),
    sass = require("gulp-sass"),
    rename = require("gulp-rename");
var clean = require('gulp-clean');


// Build JS, CSS, Docs and config files
gulp.task("build", ["buildjs", "sass", "builddocs", "copyBuiltDir"], function() {
  return gutil.log("Build Process Complete.");
});

// Build CSS
gulp.task("sass", [], function () {
  return gulp.src("../src/www/css/sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(rename("_.css"))
    .pipe(gulp.dest("../built/www"));
});

// Build JS
gulp.task("buildjs",["jshint"], shell.task([
    "node ../src/www/buildjs/r.js -o ../src/www/buildjs/build.js"
]));

// Configure the jshint task
gulp.task("jshint", [], function() {
  return gulp.src("../src/www/js/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"));
});

// Build Documentation
gulp.task("builddocs", [], shell.task([
    "cd ../ && yuidoc ../ --config 'build/yuidoc.json'"
]));

// TODO: Use a plugin here
// Build with Phonegap
gulp.task("uploadApp",[], shell.task([
    "cd ../built && phonegap remote build ios"
]));

// Copy built folder
gulp.task("copyBuiltDir",[], shell.task([
     "pwd",
     "cp -r ../src/www/assets ../built/www",
     "cp -r ../src/www/res ../built/www",
     "cp ../src/www/index.html ../built/www",
     "cp ../src/www/config.xml ../built/www",
     "cp ../src/www/assets/ss-symbolicons-block.ttf ../built/www"
]));

// Clean docs and built folder
gulp.task("clean", ["cleanBuilt", "cleanDocs"], function() {
  return gutil.log("Clean Process Complete.");
});

// Clean the built directory
gulp.task("cleanBuilt", function () {
  return gulp.src("../built/www/*", {read: false})
    .pipe(clean({force: true}));
});

// Clean the built directory
gulp.task("cleanDocs", function () {
  return gulp.src("../docs/*", {read: false})
    .pipe(clean({force: true}));
});
