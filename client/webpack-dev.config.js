const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpack = require('webpack');

module.exports = {
  context: __dirname + "/src",
	entry: "./mongo-query-runner.jsx",
	output: {
		path: __dirname + "/dist",
    filename: "mongo-client-runner-bundle.js",
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets:['env', 'react', 'stage-2']
        },
      },
      {
        test: /\.css?$/,
        loader: 'style-loader?sourceMap!css-loader?modules&importLoaders=1&localIdentName=[local]!autoprefixer-loader?browsers=last 3 versions',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    contentBase: './dist',
    hot: true,
    inline: true
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: 'true',
      'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'development'}"`
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([{from: 'assets/*', to: './'}], { debug: true }),
  ],
}
