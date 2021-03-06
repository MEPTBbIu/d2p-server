import { IStore } from "../../redux/IStore";
import * as React from "react";
import { Helmet } from "react-helmet";
import {Store} from "redux";
//import * as serialize from "serialize-javascript";

interface IHtmlProps {
	manifest?: any;
	markup?: string;
	store?: Store<IStore>;
}

class Html extends React.Component<IHtmlProps, {}> {
	private resolve(files:string[]) {
		return files
			.map(src => {
				if (!this.props.manifest[src]) {
					return;
				}
				return "/public/" + this.props.manifest[src];
			})
			.filter(file => file !== undefined);
	}

	public render() {
		const head = Helmet.rewind();
		const { markup,/* store */} = this.props;


		const styles:(string|undefined)[] =  this.resolve(["vendor.css", "app.css"]);
		const renderStyles = styles.map((src, i) => (
			<link key={i} rel="stylesheet" type="text/css" href={src} />
		));

		const scripts:(string|undefined)[] = this.resolve(["vendor.js", "app.js"]);
		const renderScripts = scripts.map((src, i) => <script src={src} key={i} />);
		//serialize(store.getState(), {isJSON: true})
		// tslint:disable-next-line:max-line-length
		const initialState = (
			<script
				dangerouslySetInnerHTML={{
					__html: `window.__INITIAL_STATE__={};`
				}}
				charSet="UTF-8"
			/>
		);

		return (
			<html>
				<head>
					{head.base.toComponent()}
					{head.title.toComponent()}
					{head.meta.toComponent()}
					{head.link.toComponent()}
					{head.script.toComponent()}
					{renderStyles}
					<link rel="shortcut icon" href="/favicon.ico" />
				</head>
				<body>
					<main id="app" dangerouslySetInnerHTML={{ __html: markup as string}} />
					{initialState}
					{renderScripts}
				</body>
			</html>
		);
	}
}

export { Html };
