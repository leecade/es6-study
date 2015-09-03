var gulp = require('gulp')
var eslint = require('gulp-eslint')

gulp.task('lint', function () {
  return gulp.src(['src/**/*.js', 'webpack.config.js', 'gulpfile.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
})

gulp.task('default', ['lint'], function () {

})
