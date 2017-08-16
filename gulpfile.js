var gulp = require('gulp');
var minifyJS = require('gulp-minify');

gulp.task('default', function() {
    console.log("Teste gulp file");
});

gulp.task('minifyJs', function() {
    gulp.src('src/js/*.js').pipe(minifyJS({
            ext: {
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest('dist'))
});