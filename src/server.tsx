import appConfig from "../config/main";

import * as e6p from "es6-promise";
(e6p as any).polyfill();
import "isomorphic-fetch";

import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { Provider } from "react-redux";
import { createMemoryHistory, match } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
const { ReduxAsyncConnect, loadOnServer } = require("redux-connect");
import {Request as exRequest, Response as exResponse} from "express-serve-static-core";
import { configureStore } from "./app/redux/store";
import routes from "./app/routes";

import { Html } from "./app/containers";
const manifest = require("../build/manifest.json");
import * as express from "express";
const path = require("path");
const compression = require("compression");
const Chalk = require("chalk");
const favicon = require("serve-favicon");
import * as webpackDevMiddleware from "webpack-dev-middleware";
import * as webpackHotMiddleware from "webpack-hot-middleware";
const  webpack = require("webpack");
import {config as webpackDevConfig} from "../config/webpack/dev";

const app = express();

app.use(compression());

if (process.env.NODE_ENV !== "production") {

  //const webpack = require('webpack');
  //const webpackConfig = require('../config/webpack/dev.js');
  const webpackCompiler = webpack(webpackDevConfig);
  const webpackDevMiddlewareOptions = {
    publicPath: webpackDevConfig.output.publicPath,
    stats:  { colors: true },
    noInfo: true,
    hot: true,
    inline: true,
    lazy: false,
    historyApiFallback: true,
    quiet: true
  };
  app.use(webpackDevMiddleware(webpackCompiler, webpackDevMiddlewareOptions));

  app.use(webpackHotMiddleware(webpackCompiler));
}

app.use(favicon(path.join(__dirname, "public/favicon.ico")));

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("*", (req:exRequest, res:exResponse) => {
  const location = req.url;
  const memoryHistory = createMemoryHistory(req.originalUrl as any);
  const store = configureStore(memoryHistory);
  const history = syncHistoryWithStore(memoryHistory , store);

match({ history, routes, location },
    (error:Error, redirectLocation:Location, renderProps:any) => {
      if (error) {
        res.status(500).send(error.message);
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        const asyncRenderData = Object.assign({}, renderProps, { store });

        loadOnServer(asyncRenderData).then(() => {
          const markup = ReactDOMServer.renderToString(
            <Provider store={store} key="provider">
              <ReduxAsyncConnect {...renderProps} />
            </Provider>,
          );
          res.status(200).send(renderHTML(markup, store));
        });
      } else {
        res.status(404).send("Not Found?");
      }
    });
});

app.listen(appConfig.port as number, appConfig.host, (err:Error) => {
  if (err) {
    console.error(Chalk.bgRed(err));
  } else {
    console.info(Chalk.black.bgGreen(
      `\n\nListening at http://${appConfig.host}:${appConfig.port}\n`,
    ));
  }
});

function renderHTML(markup: string, store: any) {
  const html = ReactDOMServer.renderToString(
    <Html markup={markup} manifest={manifest} store={store} />,
  );

  return `<!doctype html> ${html}`;
}
