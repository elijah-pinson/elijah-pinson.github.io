var gulp = require('gulp'),
    gutil = require('gulp-util'),
    connect = require('gulp-connect');

var sass = require('gulp-sass');

var uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

// live reload
gulp.task('connect', function() {
  connect.server({
    root: '.',
    livereload: true
  });
});

gulp.task('html', function() {
  gulp.src('index.html')
  .pipe(gulp.dest('build'))
  .pipe(connect.reload())
})

gulp.task('sass', function() {
  gulp.src('assets/scss/style.scss')
  .pipe(sass({style: 'expanded'}))
    .on('error', gutil.log)
  .pipe(gulp.dest('build/assets'))
  .pipe(connect.reload())
});

gulp.task('js', function() {
  gulp.src('assets/js/*.js')
  .pipe(uglify())
  .pipe(concat('script.js'))
  .pipe(gulp.dest('build/assets'))
  .pipe(connect.reload())
});

gulp.task('watch', function() {
  gulp.watch('assets/js/*.js', ['js']);
  gulp.watch('assets/scss/*.scss', ['sass']);
  gulp.watch('index.html', ['html']);
});

gulp.task('default', ['html', 'js', 'sass', 'connect', 'watch']);