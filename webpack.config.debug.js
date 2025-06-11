const path = require('path')
const webpack = require('webpack')
const PrefixWrap = require('postcss-prefixwrap')

const { ModuleFederationPlugin } = webpack.container

const deps = require('./package.json').dependencies

const srcPath = path.join(__dirname, 'src')

module.exports = (env) => ({
  context: srcPath,
  mode: 'development',
  devtool: 'eval-source-map',
  entry: './Main',
  output: {
    publicPath: 'http://localhost:8093/',
    uniqueName: 'remote1'
  },
  resolve: {
    modules: [srcPath, 'node_modules'],
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  devServer: {
    port: 8093,
    historyApiFallback: true,
    hot: false,
  },
  module: {
    rules: [
      {
        test: /(\.tsx?$)/,
        include: srcPath,
        use: [
          { loader: 'babel-loader' },
          { loader: 'ts-loader' },
        ],
      },
      {
        test: /\.css$/,
        include: srcPath,
        use: [
          'style-loader',
          'css-modules-typescript-loader',
          {
            loader: 'css-loader',
            options: { modules: { localIdentName: 'remote1_[local]__[hash:base64]' } },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.(eot|png|ttf|woff|woff2)$/,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        loader: '@svgr/webpack',
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'remote1',
      filename: 'remoteEntry.js',
      remotes: {
        appshell: 'appshell@http://localhost:8090/remoteEntry.js',
      },
      exposes: { './Main': './Main' },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
        },
      },
    })
  ],
})
