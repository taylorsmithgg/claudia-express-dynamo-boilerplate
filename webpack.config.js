const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: __dirname,
  target: 'node',
  cache: true,
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    './src/main.js'  
  ],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    loaders: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015!ts-loader'
      }, 
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    mainFiles: ['main']
  },
  devtool: '#source-map',
  plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
  ]
};