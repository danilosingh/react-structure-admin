const pkg = require('./package.json');
const rules = require('./configs/rules.config');
const { aliases } = require('./configs/aliases.config');

module.exports = {
  module: {
    rules: rules
  },
  entry: './src/index.js',
  output: {
    filename: pkg.main,
    library: '',
    libraryTarget: 'commonjs2'
  },
  externals: {
    react: 'commonjs react',
    'react-dom': 'commonjs react-dom',
    '@ant-design/compatible': 'commonjs @ant-design/compatible',
    '@fortawesome/fontawesome-svg-core':
      'commonjs @fortawesome/fontawesome-svg-core',
    '@fortawesome/react-fontawesome': 'commonjs @fortawesome/react-fontawesome',
    antd: 'commonjs antd',
    'immutability-helper': 'commonjs immutability-helper',
    moment: 'commonjs moment',
    'react-dnd': 'commonjs react-dnd',
    'react-dnd-html5-backend': 'commonjs react-dnd-html5-backend',
    'react-redux': 'commonjs react-redux',
    'react-router-dom': 'commonjs react-router-dom',
    redux: 'commonjs redux'
  },
  resolve: {
    alias: aliases,
    extensions: ['.js', '.jsx', '.json'],
    modules: ['node_modules']
  }
};
