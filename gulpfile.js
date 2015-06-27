var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('default', function() {
    gulp.src('ng-poll-img.js')
        .pipe(gulp.dest('dist/'))
        .pipe(uglify({preserveComments: 'all'}))
        .pipe(rename('ng-poll-img.min.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', ['default'], function() {
    gulp.watch('ng-poll-img.js', ['default']);
});
