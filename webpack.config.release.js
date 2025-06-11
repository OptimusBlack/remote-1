const path = require('path')
const webpack = require('webpack')
const ExternalTemplateRemotesPlugin = require('external-remotes-plugin')

const { ModuleFederationPlugin } = webpack.container

const deps = require('./package.json').dependencies

const srcPath = path.join(__dirname, 'src')
const dstPath = path.join(__dirname, 'build')

const MODULE_NAME = 'remote1'

module.exports = {
  context: srcPath,
  mode: 'production',
  devtool: false,
  entry: './Main',
  output: {
    clean: true,
    pathinfo: false,
    path: dstPath,
    publicPath: 'https://remote-1-five.vercel.app/',
    uniqueName: MODULE_NAME,
    filename: '[name].[contenthash].js',
  },
  optimization: { minimize: true },
  resolve: {
    modules: [srcPath, 'node_modules'],
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'ts-loader',
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
            options: { modules: { localIdentName: `${MODULE_NAME}_[local]__[hash:base64]` } },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: MODULE_NAME,
      filename: 'remoteEntry.js',
      remotes: {
        appshell: 'appshell@https://appshell-seven.vercel.app/remote1/remoteEntry.js?[window.cacheHash]',
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
    }),
    new ExternalTemplateRemotesPlugin(),
  ],
}
