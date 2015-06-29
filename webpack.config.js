var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:9001',
    'webpack/hot/dev-server',
    'app/app'
  ],
  output: {
    path: path.join(__dirname, '/public/dist/js/'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:9001/dist/js/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"development"',
        'PORT': '9000'
      }
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel'],
      include: path.join(__dirname, 'app')
    },{
      test: /\.json$/,
      loader: 'json'
    }]
  }
};
