//import { QRFunction, QRServerFunction, TypedEvent } from "../../utils/socketLib/socketLib";
import GSI from '../../model';
import * as sl from "../../utils/socketLib/socketLib";
import * as types from "../../utils/common/types";
//import { AvailableProjectConfig } from "../../utils/common/types";



/**
 * General utility interfaces
 */



export namespace Types {
	export type EchoQRServerData = { text: string, num: number };
	export type EchoQRData = { num: number };
	export type GameStateMessage = GSI.GameState;
	export interface TextMessage{ text: string };
	export interface DotaClientInfo {
		ip: string;
		auth: GSI.Auth;
		gamestate: GSI.GameState;
	}
}

//export const Types:Namespace  = Types as Namespace;
/**
 * Consists of the following contracts
 *
 * a contract on how the client --calls--> server
 * a contract on how the server --calls--> the client that is calling the server
 * a contract on how the server --anycasts-> all clients
 */
export const server = {
	echo: {} as sl.QRServerFunction<Types.EchoQRServerData, Types.EchoQRServerData, typeof client>,
	//newDotaClient: {} as sl.QRFunction<Types.DotaClientInfo,{}>,
	updateState: {} as  sl.QRServerFunction<GSI.GameState, {}, typeof client>,
}

export const client = {
	increment: {} as sl.QRFunction<Types.EchoQRData, Types.EchoQRData>,
	updateState: {} as sl.QRFunction<GSI.GameState,{}>
}

export const cast = {
	/** for testing */
	hello: new sl.TypedEvent<Types.DotaClientInfo>(),

	/** new dota 2 connection */
//	newGameState: new sl.TypedEvent<Types.GameStateMessage>(),
	/** Server quit */
	serverExiting: new sl.TypedEvent<{}>(),
	updateState: new sl.TypedEvent<GSI.GameState>()
}

//export default {server, client, cast, Types};