/* eslint-disable no-console */
const ROOTPATH = __dirname;
const path = require('path');
const fs = require('fs');

const rm = require('rimraf');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const webpackConfig = {
  mode: 'development',
  context: ROOTPATH,
  entry: {},
  output: {
    path: path.join(ROOTPATH, 'destination'),
    filename: '[name].bundle.js',
    publicPath: './',
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'check$': path.join(ROOTPATH, 'source', 'utils', 'check.js'),
      'storeHelpers$': path.join(ROOTPATH, 'source', 'utils', 'store', 'storeHelpersInDev.js'),
    },
    extensions: ['.js', '.vue', '.json'],
    modules: [
      path.resolve(ROOTPATH, 'source'),
      'node_modules',
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.join(ROOTPATH, 'source')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: false,
        },
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.join(ROOTPATH, 'source')],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/img/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/fonts/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.styl(us)?$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'stylus-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: {
          isProduction: false,
        },
      },
    }),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([{
      from: path.join(ROOTPATH, 'static'),
      to: path.join(ROOTPATH, 'destination', 'static'),
      toType: 'dir'
    }]),
    new FriendlyErrorsPlugin(),
  ],
};

const pathToPageFolder = path.join(ROOTPATH, 'source', 'page');
function buildCompiler() {
  console.log('compiler building...');
  const cloneWebpackConfig = Object.assign({}, webpackConfig);
  cloneWebpackConfig.entry = Object.assign({}, webpackConfig.entry);
  cloneWebpackConfig.plugins = webpackConfig.plugins.slice();
  fs.readdirSync(pathToPageFolder).forEach((fileName) => {
    const filePath = path.join(pathToPageFolder, fileName);
    if (fs.statSync(filePath).isDirectory()) {
      const pageName = fileName;
      cloneWebpackConfig.entry[pageName] = path.join(pathToPageFolder, pageName, `${pageName}.js`);
      cloneWebpackConfig.plugins.push(
        new HtmlWebpackPlugin({
          chunks: ['vendor', pageName],
          filename: `${pageName}.html`,
          template: 'template.html',
          inject: true,
        })
      );
    }
  });

  return webpack(cloneWebpackConfig);
}

let watching;
function watchingAndCompile(compiler) {
  if (watching) {
    console.log('restart watching...');
    watching.close();
  }
  else {
    console.log('start watching...');
  }
  let lastHash;
  rm(path.join(ROOTPATH, 'destination'), () => {
    watching = compiler.watch(
      {
        ignored: /node_modules/,
      },
      (err, stats) => {
        if (err) {
          // Do not keep cache anymore
          compiler.purgeInputFileSystem();
          lastHash = null;
          console.error(err.stack || err);
          if (err.details) {
            console.error(err.details);
          }
          process.exit(1);
        }
        if (stats.hash !== lastHash) {
          lastHash = stats.hash;
          if (stats.compilation && stats.compilation.errors.length !== 0) {
            const { errors } = stats.compilation;
            if (errors[0].name === 'EntryModuleNotFoundError') {
              console.error(`
                \u001b[1m\u001b[31mInsufficient number of arguments or no entry found.
              `);
              console.error(`\u001b[1m\u001b[31mAlternatively, run 'webpack(-cli) --help' for usage info.\u001b[39m\u001b[22m
              `);
            }
          }
          const statsString = stats.toString({
            all: false,
            colors: true,
            entrypoints: true,
            env: true,
            errors: true,
            errorDetails: true,
          });
          if (statsString) {
            process.stdout.write(`${statsString}\n\n\n`);
          }
        }
      },
    );
  });
}

// initial watchingAndCompile
watchingAndCompile(buildCompiler());

// watching page folder, if rename happens, rebuild compiler and watching
fs.watch(pathToPageFolder, (eventName) => {
  if (eventName === 'rename') {
    watchingAndCompile(buildCompiler());
  }
});

require('./devServer').start();
