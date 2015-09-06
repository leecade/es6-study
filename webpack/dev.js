import fs from 'fs'
import path from 'path'
import webpack from 'webpack'

export const paths = {
  base: path.normalize(path.join(__dirname, '..'))
}

;['src', 'dist', 'public', 'node_modules'].map((p) => paths[p] = path.join(paths.base, p))

export default {
  entry: ['webpack/hot/dev-server', path.join(paths.src, 'webpack-example/index.js')],
  output: {
    path: path.join(paths.dist, 'webpack-example/js'),
    filename: 'bundle.js'
  // publicPath: 'js/'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css?modules'
      },
      {
        test: /\.js$/,
        loader: 'babel'
      },

      // <=8k的图片使用base64内联
      // {
      //   test: /\.(png|jpg|gif)$/,
      //   loader: 'url-loader?limit=8192'
      // },

      // 其他的作为文件处理(兼容<IE8的browser)
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader'
      }
    ]
  },

  // configure for webpack-dev-server
  devServer: {
    stats: {
      colors: true,
      noInfo: true
    },
    contentBase: './dist/webpack-example',
    // publicPath: './public',
    historyApiFallback: true,

    // not working?
    hot: true,
    // inline: true,

    noInfo: true,
    progress: true
  },
  plugins: [

    // 可把当前打包的hash map用json储存, 给页面调用.
    function () {
      // 文件名带[hash]的时候, 必须依赖stats
      this.plugin('done', function (stat) {
        // stat.json的assetsByChunkName, 包含了build后的文件列表
        fs.writeFileSync('./map.json', JSON.stringify(stat.toJson().assetsByChunkName))
      })
    },
    // Avoid publishing files when compilation failed
    new webpack.NoErrorsPlugin(),

    new webpack.HotModuleReplacementPlugin()
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
