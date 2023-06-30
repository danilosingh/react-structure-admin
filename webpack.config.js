const pkg = require('./package.json');
const rules = require('./configs/rules.config');
const { aliases } = require('./configs/aliases.config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  module: {
    rules: rules
  },
  // plugins: [
  //   new BundleAnalyzerPlugin()
  // ],
  entry: './src/index.js',
  output: {
    filename: pkg.main,
    library: '',
    libraryTarget: 'commonjs2'
  },
  externals: [
    {
      react: 'commonjs2 react',
      lodash: 'commonjs2 lodash',
      'react-dom': 'commonjs2 react-dom',
      '@ant-design/compatible': 'commonjs2 @ant-design/compatible',
      '@ant-design/icons': 'commonjs2 @ant-design/icons',
      '@ant-design/compatible/assets/index.css': 'commonjs2 @ant-design/compatible/assets/index.css',
      '@fortawesome/fontawesome-svg-core':
        'commonjs2 @fortawesome/fontawesome-svg-core',
      '@fortawesome/react-fontawesome': 'commonjs2 @fortawesome/react-fontawesome',
      'immutability-helper': 'commonjs2 immutability-helper',
      'react-helmet': 'commonjs2 react-helmet',
      moment: 'commonjs2 moment',
      'react-dnd': 'commonjs2 react-dnd',
      'react-dnd-html5-backend': 'commonjs2 react-dnd-html5-backend',
      'react-redux': 'commonjs2 react-redux',
      'react-router-dom': 'commonjs2 react-router-dom',
      'css-loader': 'commonjs2 css-loader',
      'style-loader': 'commonjs2 style-loader',
      'sass-loader': 'commonjs2 sass-loader',
      redux: 'commonjs2 redux',
      axios: 'commonjs2 axios'
    },
    /^@ant-design[.]*/,
    /^antd[.]*/
  ],
  resolve: {
    alias: aliases,
    extensions: ['.js', '.jsx', '.json'],
    modules: ['node_modules']
  }
};
