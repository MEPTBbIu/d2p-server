//import * as sl from "../../utils/socketLib/socketLib";
import { QRFunction, QRServerFunction, TypedEvent } from "../../utils/socketLib/socketLib";
//import * as types from "../../utils/common/types";
//import { AvailableProjectConfig } from "../../utils/common/types";

/**
 * Consists of the following contracts
 *
 * a contract on how the client --calls--> server
 * a contract on how the server --calls--> the client that is calling the server
 * a contract on how the server --anycasts-> all clients
 */
export var server = {
	echo: {} as QRServerFunction<{ text: string, num: number }, { text: string, num: number }, typeof client>
}

export var client = {
	increment: {} as QRFunction<{ num: number }, { num: number }>,
}

export var cast = {
	/** for testing */
	hello: new TypedEvent<{ text: string }>()
}

export default {server, client, cast};