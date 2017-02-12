var gulp = require('gulp');

var pump = require('pump');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var ts = require('gulp-typescript');

var config = {
    api: {
        fontawesome: {
            fonts: "bower_components/font-awesome/fonts/**/*",
            sass: "bower_components/font-awesome/scss/"
        },
        jquery: "bower_components/jquery/dist/jquery.min.js",
        materialize: {
            js: "bower_components/materialize/dist/js/materialize.min.js",
            fonts: 'bower_components/materialize/dist/fonts/**/*',
            sass: "bower_components/materialize/sass/"
        },
    },
    js: {
        src: "src/js/app.js",
        dest: "public/js"
    },
    ts: {
        src: "app/**/*.ts",
        dest: "build/"
    }
};

gulp.task('client', function(callback) {
    pump([
        browserify({ entries: config.js.src, debug: true })
            .transform("babelify", { presets: ["es2015"] })
            .bundle(),
        source('app.js'),
        buffer(),
        uglify(),
        gulp.dest(config.js.dest),
        livereload()
    ], callback);
});

gulp.task('server', function(callback) {
    pump([
        gulp.src(config.ts.src),
        ts({
            module: "commonjs",
            noImplicitAny: false
        }),
        gulp.dest(config.ts.dest)
    ], callback)
});

gulp.task('default', ['client', 'server']);