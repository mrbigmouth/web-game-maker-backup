/* eslint-disable no-console */
const ROOTPATH = __dirname;
const path = require('path');
const url = require('url');
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

const connect = require('connect');
const serveStatic = require('serve-static');
const WebSocket = require('ws');

// watching data change
const pathToDataJson = path.join(ROOTPATH, 'source', 'chrome', 'imports', 'data.json');
let data;
function loadData() {
  console.log('loading data...');
  const dataText = fs.readFileSync(pathToDataJson, {
    encoding: 'utf8',
  });
  if (dataText) {
    try {
      data = JSON.parse(dataText);
    }
    catch(e) {
      console.error(e);
      console.log('!');
      console.log(dataText);
    }
  }
}
fs.watch(pathToDataJson, () => {
  console.log('initial data.json was changed!');
  loadData();
});
loadData();

const server = connect();
server
  .use(serveStatic(path.join(ROOTPATH, 'destination')))
  .use((req, res, next) => {
    const { pathname } = url.parse(req.url);
    console.log(pathname);
    if (pathname === '/favicon.ico') {
      const iconPath = path.join(ROOTPATH, 'static', 'favicon.ico');
      const iconFile = fs.readFileSync(iconPath);
      res.end(iconFile);
    }

    next();
  })
  .use((req, res, next) => {
    console.log('404!');
    console.log(req.method, req.url);
    next();
  });
server.listen(3000);
console.log('server listening 3000...');

const wsServer = new WebSocket.Server({
  port: 3001,
});
console.log('websocket server listening 3001...');
wsServer.on('connection', (ws) => {
  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    console.log(parsedMessage);
    try {
      switch (parsedMessage.type) {
        case 'initialize': {
          const dataPathHash = {};
          copyDataToPathHash({
            i18n: data.i18n,
            sync: data.sync,
          }, dataPathHash);
          const message = {
            source: parsedMessage.source,
            stamp: parsedMessage.stamp,
            data: dataPathHash,
          };
          console.log(dataPathHash);
          ws.send(JSON.stringify(message));
          break;
        }
        case 'update': {
          const payload = parsedMessage.payload;
          const needSyncPayload = {};
          Object.keys(payload).forEach((path) => {
            const value = payload[path];
            updateDevInMemoryData(path, value);
            setNeedSyncPayload(path, value, needSyncPayload);
          });
          parsedMessage.payload = needSyncPayload;
          const sendMessage = JSON.stringify(parsedMessage);
          wsServer.clients.forEach((ws) => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(sendMessage);
            }
          });
          break;
        }
        case 'read': {
          const pathList = parsedMessage.pathList;
          const message = {
            stamp: parsedMessage.stamp,
          };
          setReadMessage(message, pathList);
          ws.send(JSON.stringify(message));
          break;
        }
      }
    }
    catch (e) {
      console.error(e);
      const message = {
        ...parsedMessage,
        error: {
          code: 'e00000',
          details: e,
        },
      };
      ws.send(JSON.stringify(message));
    }
    fs.writeFile(
      path.join(ROOTPATH, 'source', 'chrome', 'imports', 'data.json'),
      JSON.stringify(data, null, 2),
      () => {},
    );
  });
});
function copyDataToPathHash(data, dataPathHash, prefix = '/') {
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (Object.prototype.toString.call(value) === '[object Object]') {
      copyDataToPathHash(value, dataPathHash, prefix + key + '/');
    }
    else {
      dataPathHash[prefix + key] = value;
    }
  });
}
function updateDevInMemoryData(path, value) {
  const paceList = path.split('/');
  let updateTarget = data;
  const updateField = paceList.pop();
  paceList.forEach((pace) => {
    if (pace) {
      updateTarget = updateTarget[pace];
    }
  });
  updateTarget[updateField] = value;
}
function setNeedSyncPayload(path, value, needSyncPayload) {
  const slicedPath = path.slice(0, 5);
  if (slicedPath === '/i18n' || slicedPath === '/sync') {
    needSyncPayload[path] = value;
  }
}
function setReadMessage(message, pathList) {
  const readData = {};
  const error = [];
  pathList.forEach((path) => {
    const paceList = path.split('/');
    let result = data;
    try {
      paceList.forEach((pace) => {
        if (pace) {
          result = result[pace];
        }
      });
    }
    catch (e) {
      error.push({
        code: 'e00001',
        params: {
          path,
        },
      });
    }

    readData[path] = result;
  });
  message.data = readData;
  if (error.length) {
    message.error = error;
  }

  return message;
}


