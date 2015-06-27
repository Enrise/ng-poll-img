var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');

gulp.task('lint', function() {
    return gulp.src('ng-poll-img.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build', function() {
    gulp.src('ng-poll-img.js')
        .pipe(gulp.dest('dist/'))
        .pipe(uglify({preserveComments: 'all'}))
        .pipe(rename('ng-poll-img.min.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['lint', 'build']);
gulp.task('watch', ['default'], function() {
    gulp.watch('ng-poll-img.js', ['default']);
});
