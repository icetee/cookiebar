const gulp = require('gulp'),
    path = require('path'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    server = require('gulp-express'),
    cssnano = require('gulp-cssnano'),
    autoprefixer = require('gulp-autoprefixer');

// Import the package
const pkg = require('./package.json');
pkg.date = new Date().toISOString().replace(/\.\d{3}/, "");

// Header
const banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * Date <%= pkg.date %>',
    ' * ',
    ' * @author <%= pkg.author %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    '', ''
].join('\n');

const paths = {
    watch: {
        src: 'src/',
        js: 'src/**/*.js',
        css: 'src/**/*.css'
    },
    dist: './dist/'
};

// Assets
gulp.task('scripts', function() {
    gulp.src(['src/scripts/vanilla.js', paths.watch.js])
        //Check valid
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(concat(pkg.name + '.js'))
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(gulp.dest(paths.dist))

    //Minify
    .pipe(uglify())
        .pipe(rename(pkg.name + '.min.js'))
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('styles', function() {
    gulp.src(paths.watch.css)
        //Autoprefixer
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(concat(pkg.name + '.css'))
        .pipe(gulp.dest(paths.dist))

    //Minify
    .pipe(cssnano())
        .pipe(rename(pkg.name + '.min.css'))
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(gulp.dest(paths.dist));
});

// Core
gulp.task('build', ['styles', 'scripts']);

gulp.task('server', ['build'], function() {
    // Start server
    server.run(['index.js']);

    // Restart the server when file changes
    gulp.watch([paths.watch.css], ['styles'], server.notify);
    gulp.watch([paths.watch.js], ['scripts']);
});

// Events
gulp.task('start', ['build'], function() {
    // Disable livereload
    server.run(['index.js'], null, false);
});

// Set default task
gulp.task('default', ['start']);
