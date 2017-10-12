var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var utilities = require('gulp-util');
var del  = require('del');
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync').create();

var lib = require('bower-files')({
  "overrides":{
    "bootstrap" : {
      "main": [
        "less/bootstrap.less",
        "dist/css/bootstrap.css",
        "dist/js/bootstrap.js"
      ]
    }
  }
});

var buildProduction = utilities.env.production;


gulp.task('default', function(){
  console.log('gulp running');
});

// gulp.task('concatInterface', function() {
//   return gulp.src(['./src/js/*-interface.js', './js/*-interface.js'])
//     .pipe(concat('allConcat.js'))
//     .pipe(gulp.dest('./tmp'));
// });


//using vinyl-source-stream: 
gulp.task('browserify', function() {
  var bundleStream = browserify('./src/js/*.js').bundle()
 
  bundleStream
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/js'))
});

gulp.task("minifyScripts", ['browserify'], function(){
  return gulp.src("./build/js/app.js")
  .pipe(uglify())
  .pipe(gulp.dest("./build/js"))
});

gulp.task("clean", function(){
  return del(['build', 'tmp']);
});;

gulp.task("build", ["clean"], function(){
  if (buildProduction){
    gulp.start('minifyScripts');
  } else {
    gulp.start('browserify');
  }
  gulp.start('bower');
});

gulp.task('jshint', function(){
  return gulp.src(['src/js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('bowerJS', function () {
  return gulp.src(lib.ext('js').files)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});

gulp.task('bowerCSS', function () {
  return gulp.src(lib.ext('css').files)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./build/css'));
});


gulp.task('bower', ['bowerJS', 'bowerCSS']);

gulp.task('serve', function(){
  browserSync.init({
    server: {
      baseDir: './',
      index: 'index.html'
    }
  });
  gulp.watch(['src/js/*.js'], ['jsBuild']);
  gulp.watch(['bower.json'], ['bowerBuild']);
});

gulp.task('jsBuild', ['browserify', 'jshint'], function(){
  browserSync.reload();
});

gulp.task('bowerBuild', ['bower'], function(){
  browserSync.reload();
})






