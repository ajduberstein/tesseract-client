const webpack = require('webpack'); // eslint-disable-line
const {resolve, join} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const CONFIG = {
  mode: 'development',
  entry: resolve('src/app.js'),
  output: {
    path: `${__dirname}/dist`,
    filename: 'dist/bundle.js'
  },
  devServer: {
    contentBase: join(__dirname, 'index.html'),
    compress: false,
    port: 9000
  },
  plugins: [
    // new webpack.EnvironmentPlugin(['GoogleMapsToken'])
    new HtmlWebpackPlugin()
  ],
  module: {
    rules: [{
      test: /.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-react', '@babel/preset-env'],
        plugins: [
          '@babel/plugin-proposal-class-properties'
        ]
      }
    }]
  }
};

module.exports = CONFIG;