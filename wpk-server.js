var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: '/public/dist/js/',
  contentBase: './public/dist/js/',
  hot: true,
  historyApiFallback: true,
  stats: { colors: true },
  headers: {
    'Access-Control-Allow-Origin': 'http://localhost:9000',
    'Access-Control-Allow-Headers': 'X-Requested-With'
  }
}).listen(9001, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }
  console.log('WebpackDevServer listening at localhost:9001');
});
