import {QRFunction,QRServerFunction,QRServerMap} from '../../utils/socketLib/socketLib';
import {onServerExit} from "./serverExit";
import * as sl from "../../utils/socketLib/socketLib";
import * as sls from "../../utils/socketLib/socketLibServer";
import * as contract  from "./socketContract";
import  {Types, client}  from "./socketContract";
import http from "http";
import https from "https";
//import { onNewDotaClient } from './newDotaClient';

namespace Server {
	export const echo: typeof contract.server.echo =  (data, client) => {
		return client
			.increment({ num: data.num })
			.then((value:Types.EchoQRData) =>({num:value.num, text:data.text}) );
	}

	export const updateState: typeof  contract.server.updateState = (state, client)	=> {
		//const clientUpdateState = client.updateState;
		console.log("Server->updateState->Start");
		return client.updateState(state);
	}
}


// Ensure that the namespace follows the contract
var _checkTypes: typeof contract.server = Server;

/** Will be available after register is called */
export let cast = contract.cast;

export function register(app: http.Server | https.Server) {
	let runResult = sls.run({
		app,
		serverImplementation: Server,
		clientContract: contract.client,
		cast: contract.cast
	});

	cast = runResult.cast;

//	onNewDotaClient((dotaClient)=> cast.newDotaClient.emit(dotaClient)//{
		//Server.newDotaClient(dotaClient).then((value)=>
		//cast.newDotaClient.emit(value))}
//	);
	/** If the server exits notify the clients */
	onServerExit(() => cast.serverExiting.emit({}));
	cast.updateState.on((state)=>Server.updateState(state, client));
	// For testing
	// setInterval(() => cast.hello.emit({ text: 'nice' }), 1000);

	return runResult;
}