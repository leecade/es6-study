import gulp from 'gulp'
import eslint from 'gulp-eslint'
import runSequence from 'run-sequence'

const paths = {
  lint: [
    'gulpfile.babel.js',
    'src/**/*.js',
    'webpack.config.js'
  ]
}

const runEslint = () => {
  return gulp.src(paths.lint)
  .pipe(eslint())
  .pipe(eslint.format())
}

gulp.task('lint', () => {
  return runEslint()
})

gulp.task('lint-ci', () => {

  // Exit process with an error code (1) on lint error for CI build.
  return runEslint().pipe(eslint.failAfterError())
})

gulp.task('test', (done) => {

  // Run a series of test tasks in order.
  runSequence('lint-ci', done)
})

gulp.task('default', ['lint'], () => {

})
