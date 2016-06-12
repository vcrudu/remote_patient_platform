var jshint = require('gulp-jshint');
var gulp   = require('gulp');

gulp.task('lint', function() {
    return gulp.src('./test/repositories/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});