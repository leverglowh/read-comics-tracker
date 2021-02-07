const path = require('path');
module.exports = function override(config, env) {
  return {
    ...config,
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src'),
      },
      modules: ['node_modules', path.resolve(__dirname, 'src')],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  };
};
