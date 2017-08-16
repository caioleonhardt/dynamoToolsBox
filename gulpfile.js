var gulp = require('gulp');
var minifyJS = require('gulp-minify');
var cssMinify = require('gulp-clean-css');
var replace = require('gulp-replace');
var fs = require('fs');
var jsConcat = require('gulp-concat');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');

gulp.task('concatJS', function() {
    return gulp.src([
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

gulp.task('replaceCSSInJS', function() {
    return gulp.src('dist/extension.js')
        .pipe(replace('{{css}}', fs.readFileSync('build/css/style.min.css', 'utf8')))
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
        'replaceCSSInJS',
        'minifyJs',
        callback
    );
});