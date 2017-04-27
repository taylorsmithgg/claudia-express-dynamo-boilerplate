/* eslint no-console: 0 */
const path = require('path');
const express = require('express');

const env = process.env.NODE_ENV;
const port = env !== 'production' ? 3000 : process.env.PORT;

const server = require('./server');

const app = server.default.bootstrap().app;

if (env !== 'production') {
    const webpack = require('webpack');
    const webpackMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const config = require(process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG : '../dist/webpack.config.js');
    const compiler = webpack(config);

    console.log(`CONFIG.OUTPUT.PUBLICPATH: ${config.output.publicPath}`);

    const middleware = webpackMiddleware(compiler, {
        noInfo: true,
        publicPath: '/',
        contentBase: '../src',
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler, {
      log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
    }));

    app.use(express.static(__dirname));

    app.get('*', function response(req, res) {
        try {
            res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'views/index.html')));
        } catch(e) {
            console.log(e);
            res.write(`ERROR: ${e}`);
        }
        res.end();
    });
} else {

  app.use(express.static(__dirname));
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

}

app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});