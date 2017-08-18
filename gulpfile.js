var gulp = require('gulp');
var minifyJS = require('gulp-minify');
var cssMinify = require('gulp-clean-css');
var replace = require('gulp-replace');
var fs = require('fs');
var jsConcat = require('gulp-concat');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var htmlMinify = require('gulp-htmlmin');

gulp.task('concatJS', function() {
    return gulp.src([
            'src/js/core.js',
            'src/js/render.js',
            'src/js/request.js',
            'src/js/global.js',
            'src/js/inject.js',
            'src/js/extension.js'
        ])
        .pipe(jsConcat('extension.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('minifyCSS', function() {
    return gulp.src('src/css/style.css')
        .pipe(cssMinify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('build/css'));
});

gulp.task('compressHTML', function() {
    return gulp.src('src/html/box.html')
        .pipe(htmlMinify({
            collapseWhitespace: true
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('build/html'));
});

gulp.task('replaceCSSInJS', function() {
    return gulp.src('dist/extension.js')
        .pipe(replace('{{css}}', fs.readFileSync('build/css/style.min.css', 'utf8')))
        .pipe(gulp.dest('dist'));
});

gulp.task('replaceHTMLInJS', function() {
    return gulp.src('dist/extension.js')
        .pipe(replace('{{htmlBox}}', fs.readFileSync('build/html/box.min.html', 'utf8')))
        .pipe(gulp.dest('dist'));
});

gulp.task('minifyJs', function() {
    gulp.src('dist/extension.js').pipe(minifyJS({
            ext: {
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('default', function(callback) {
    runSequence(
        'concatJS',
        'minifyCSS',
        'compressHTML',
        'replaceCSSInJS',
        'replaceHTMLInJS',
        'minifyJs',
        callback
    );
});