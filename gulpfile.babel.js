import path from 'path'
import gulp from 'gulp'
import gutil from 'gulp-util'
import standard from 'gulp-standard'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import runSequence from 'run-sequence'
import devConfig from './webpack/dev'
import inject from 'gulp-inject-string'

const paths = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist'),
  public: path.join(__dirname, 'public'),
  lint: [
    'gulpfile.babel.js',
    'src/**/*.js',
    'webpack.config.js'
  ]
}

const ports = {
  dev: 8080
}

const runEslint = (opts = {}) => {
  return gulp.src(paths.lint)
    .pipe(standard())
    .pipe(standard.reporter('default', opts))
}

gulp.task('lint', () => {
  return runEslint()
})

gulp.task('lint-ci', () => {

  // Exit process with an error code (1) on lint error for CI build.
  return runEslint({
    breakOnError: true
  })
})

gulp.task('test', (done) => {

  // Run a series of test tasks in order.
  runSequence('lint-ci', done)
})

gulp.task('build', (done) => {
  webpack(devConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack:build', err)
    gutil.log('[webpack:build]', stats.toString({
      colors: true
    }))
    done()
  })
})

gulp.task('webpack-dev-inject', () => {

  // @TODO bundle.js path in deploy task
  const webpackHotInject = `
    <script src="http://localhost:${ports.dev}/webpack-dev-server.js"></script>
    <script src="bundle.js"></script>
  `
  return gulp.src(path.join(paths.src, 'webpack-example/index.html'))
      .pipe(inject.after('</body>', webpackHotInject))
      .pipe(gulp.dest(path.join(paths.dist, 'webpack-example')))
})

gulp.task('dev', ['webpack-dev-inject'], (done) => {
  let compiler = webpack(devConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack:build', err)
    gutil.log('[webpack:build]', stats.toString({
      colors: true
    }))
    done()
  })

  let server = new WebpackDevServer(compiler, devConfig.devServer)

  server.listen(ports.dev, 'localhost', (err) => {
    if (err) throw new gutil.PluginError('webpack-dev-server', err)
    // Server listening
    gutil.log('[webpack-dev-server]', `http://localhost:${ports.dev}/webpack-dev-server/index.html`)

    // keep the server alive or continue?
    // done()
  })
})

gulp.task('default', ['lint'], (done) => {

})
