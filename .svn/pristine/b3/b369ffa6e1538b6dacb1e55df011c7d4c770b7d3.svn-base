const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,    // Keep class names
          keep_fnames: true        // Keep function names
        },
      }),
    ],
  },
};
