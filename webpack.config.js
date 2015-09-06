var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: ['webpack/hot/dev-server', './src/webpack-example/mod/index.js'],
  output: {
    path: './src/webpack-example',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    // Avoid publishing files when compilation failed
    new webpack.NoErrorsPlugin(),
  ],
  stats: {
    // Nice colored output
    colors: true
  },
  // Create Sourcemaps for the bundle
  devtool: 'source-map',
  resolve: {
    // require('file') instead of require('file.coffee')
    extensions: ['', '.js', '.json', '.coffee']
  }
}
