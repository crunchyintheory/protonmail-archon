var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('build', function() {
    return gulp.src('./*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist'));
});