const autoprefixer = require('autoprefixer');

const rules = [
  {
    test: /\.css$/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          plugins: [
            autoprefixer({
              grid: 'autoplace'
            })
          ]
        }
      }
    ]
  },
  {
    test: /\.less$/,
    use: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader'
      },
      {
        loader: 'less-loader',
        options: {
          lessOptions: {
            javascriptEnabled: true
          }
        }
      }
    ]
  },
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/react'],
        plugins: [
          '@babel/plugin-syntax-dynamic-import',
          '@babel/plugin-proposal-class-properties',
          ['import', { libraryName: 'antd', style: true }]
        ]
      }
    }
  }
];

module.exports = rules;
