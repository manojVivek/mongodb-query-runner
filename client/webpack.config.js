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
        loader: 'style-loader?sourceMap!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!autoprefixer-loader?browsers=last 3 versions',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
}
