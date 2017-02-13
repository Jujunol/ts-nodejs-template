var gulp = require('gulp');

var pump = require('pump');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var ts = require('gulp-typescript');
var sass = require('gulp-sass');

var config = {
    api: {
        fontawesome: {
            fonts: "res/font-awesome/fonts/**/*",
            sass: "res/font-awesome/scss/"
        },
        jquery: "res/jquery/dist/jquery.min.js",
        materialize: {
            js: "res/materialize/dist/js/materialize.min.js",
            fonts: 'res/materialize/dist/fonts/**/*',
            sass: "res/materialize/sass/"
        },
    },
    ts: {
        src: "app/**/*.ts",
        dest: "build/"
    },
    js: {
        src: "src/js/app.js",
        dest: "public/js"
    },
    sass: {
        src: "src/sass/**/*.scss",
        dest: "public/css"
    },
    fonts: "public/fonts"
};

gulp.task('style', function(callback) {
    var options = {
        includePaths: [
            config.api.fontawesome.sass,
            config.api.materialize.sass
        ],
        outputStyle: "compressed"
    };
    pump([
        gulp.src(config.sass.src),
        sass(options),
        gulp.dest(config.sass.dest),
        livereload()
    ], callback);
});

gulp.task('fonts', function(callback) {
    pump([
        gulp.src(config.api.materialize.fonts),
        gulp.dest(config.fonts)
    ]);
    pump([
        gulp.src(config.api.fontawesome.fonts),
        gulp.dest(config.fonts)
    ], callback);
});

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
        gulp.dest(config.ts.dest),
        livereload()
    ], callback)
});

gulp.task('default', ['server', 'style', 'fonts']);