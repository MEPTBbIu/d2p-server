/// <reference types="webpack" />

import * as fs from "fs";
import * as path from "path";
import * as webpack from "webpack";
const postcssAssets = require("postcss-assets");
const postcssNext = require("postcss-cssnext");
const stylelint = require("stylelint");
const ManifestPlugin = require("webpack-manifest-plugin");
const CheckerPlugin = require("awesome-typescript-loader").CheckerPlugin;

import * as awesomeTypescriptLoader from "awesome-typescript-loader";

const getCssRules = (ruleType: "bsw" | "default" = "default"): webpack.Rule[] => {
	const bswCssRule = () => {
		const autoprefixer = require("autoprefixer");

		return {
			test: /\.css$/,
			include: path.resolve("./src/app"),
			use: [
				"style-loader",
				{ loader: "css-loader", options: { importLoaders: 1 } },
				//   require.resolve('postcss-loader'),
				{
					loader: "postcss-loader",
					options: {
						config: {
							path: "./postcss.config.js",
						},
						//   parser: 'sugarss',
						//  exec: true,
						// Necessary for external CSS imports to work
						// https://github.com/facebookincubator/create-react-app/issues/2677
						ident: "postcss",
						plugins: () => [
							// require("postcss-flexbugs-fixes"),
							autoprefixer({
								browsers: [
									">1%",
									"last 4 versions",
									"Firefox ESR",
									"not ie < 9", // React doesn't support IE8 anyway
								],
								flexbox: "no-2009",
							})
						],
					},
				}
			],
		}
	};

	return (ruleType === "bsw") ? [bswCssRule()]
		: [
			{
				test: /\.css$/,
				include: path.resolve("./src/app"),
				loaders: [
					"style-loader",
					"css-loader?modules&importLoaders=2&localIdentName=[local]___[hash:base64:5]",
					"postcss-loader"
				]
			},
			{
				test: /\.css$/,
				exclude: path.resolve("./src/app"),
				loaders: [
					"style-loader",
					"css-loader"
				]
			}
		];

};


export var config = {
	// Enable sourcemaps for debugging webpack's output.
	devtool: "source-map",

	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx"],
		modules: [path.resolve(__dirname), "node_modules", "app", "app/redux"],
	},

	entry: {
		app: [
			"webpack-hot-middleware/client?reload=true",
			"./src/client.tsx",
			//  './src/vendor/main.ts'
		]
	},

	output: {
		path: path.resolve("./build/public"),
		publicPath: "/public/",
		filename: "js/[name].js",
		pathinfo: true
	},

	module: {
		rules: [
			/*{
			enforce: 'pre',
			test: /\.tsxx?$/,
			loader: 'tslint-loader'
			},*/
			{
				test: /\.tsx?$/,
				loader: "react-hot-loader/webpack!awesome-typescript-loader"
			},
			{
				test: /\.jsx$/,
				loader: "babel-loader"
			},
			{
				test: /\.json$/,
				loader: "json-loader"
			},
			...getCssRules("bsw"),
			{
				test: /\.eot(\?.*)?$/,
				loader: "file-loader?name=fonts/[hash].[ext]"
			},
			{
				test: /\.(woff|woff2)(\?.*)?$/,
				loader: "file-loader?name=fonts/[hash].[ext]"
			},
			{
				test: /\.ttf(\?.*)?$/,
				loader: "url-loader?limit=10000&mimetype=application/octet-stream&name=fonts/[hash].[ext]"
			},
			{
				test: /\.svg(\?.*)?$/,
				loader: "url-loader?limit=10000&mimetype=image/svg+xml&name=fonts/[hash].[ext]"
			},
			{
				test: /\.(jpe?g|png|gif)$/i,
				loader: "url-loader?limit=1000&name=images/[hash].[ext]"
			}
		]
	},

	plugins: [
		new CheckerPlugin(),
		new webpack.LoaderOptionsPlugin({
			debug: true,
			options: {
				tslint: {
					failOnHint: true
				},
				postcss: () => [
					stylelint({
						files: "../../src/app/*.css"
					}),
					postcssNext(),
					require("postcss-assets")({
						relative: true
					})
				],
			}
		}),
		new ManifestPlugin({
			fileName: "../manifest.json"
		}),
		new webpack.DefinePlugin({
			'process.env': {
				BROWSER: JSON.stringify(true),
				NODE_ENV: JSON.stringify("development")
			}
		}),
		new webpack.HotModuleReplacementPlugin()
	]
};

const copySync = (src, dest, overwrite) => {
	if (overwrite && fs.existsSync(dest)) {
		fs.unlinkSync(dest);
	}
	const data = fs.readFileSync(src);
	fs.writeFileSync(dest, data);
};

const createIfDoesntExist = dest => {
	if (!fs.existsSync(dest)) {
		fs.mkdirSync(dest);
	}
};



createIfDoesntExist("./build");
createIfDoesntExist("./build/public");
copySync("./src/favicon.ico", "./build/public/favicon.ico", true);

export default config;