var gulp        = require('gulp');
var gulpif      = require('gulp-if');
var gutil       = require('gulp-util');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var browserify  = require('browserify');
var babelify    = require('babelify');
var watchify    = require('watchify');
var merge       = require('merge-stream');
var sourcemaps  = require('gulp-sourcemaps');
var uglify      = require('gulp-uglify');
var enabled     = require('../enabled');
var argv        = require('minimist')(process.argv.slice(2));
var manifest    = require('asset-builder')('./manifest.json');
var paths       = manifest.paths;

function onBundleError(error){
  gutil.log(
    gutil.colors.red("Browserify error:"), 
    error.message
  );
  this.emit('end');
}

module.exports = function(cb){

  var merged = merge();

  manifest.forEachDependency('js', function(dependency, index){
    
    var bundler = browserify({
        entries: dependency.globs,
        extensions: [".babel", ".js"],
        debug: true,
        cache: {},
        packageCache: {}
        // , plugin: [watchify]
      });

    var doBundle = function(){
      gutil.log(
        gutil.colors.magenta("Starting bundle for:"),
        dependency.name
      );
      
      // Run browserify + sourcemaps + etc on each dependency
      return bundler.transform(babelify, {
        presets: ["es2015"],
        extensions: [".babel"]
      })
      .bundle(function(err, buf){
          if (err){
            gutil.log(
              gutil.colors.red("Bundle error:"),
              err.toString()
            )
          } else {
            gutil.log(
              gutil.colors.green("Finished bundle for:"),
              dependency.name
            )
          }
      })
      .on('error', onBundleError)
      .pipe(source(dependency.name)) // .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(
        gulpif(enabled.maps, sourcemaps.init({loadMaps: true}))
      )
      .pipe(uglify())
      .pipe(
        gulpif(enabled.maps, sourcemaps.write('.', {
          sourceRoot: paths.source + 'js/'
        }))
      )
      .pipe(gulp.dest(paths.dist + 'js'));
    }

    bundler.on('bundle', function() {
      cb()
    });

    doBundle();
  });

  // return merged;
}