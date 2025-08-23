const webpack = require('webpack');

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "stream": require.resolve("stream-browserify"),
    "util": require.resolve("util/"),
    "url": require.resolve("url/"),
    "zlib": require.resolve("browserify-zlib"),
    "assert": require.resolve("assert/"),
    "buffer": require.resolve("buffer/")
  });
  config.resolve.fallback = fallback;

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      'process.env.NODE_DEBUG': JSON.stringify(false)
    })
  ]);
  
  config.resolve.alias = {
    ...config.resolve.alias,
    'process': 'process/browser.js'
  };

  // Ignore source map warnings from node_modules
  config.ignoreWarnings = [/Failed to parse source map/];

  return config;
};
