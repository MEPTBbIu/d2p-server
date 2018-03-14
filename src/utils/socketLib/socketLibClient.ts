
import * as io from "socket.io-client"
import {
  anycastMessageName, CastMessage, RequesterResponder, TypedEvent, QRFunction, QRServerMap,
QRCastMap, QRClientMap} from "./socketLib";

let socketIo = io;
let origin = "http://localhost:3000";
//`${window.location.protocol}//${window.location.hostname}${(window.location.port ? ':' + window.location.port : '') }`;

export var resolve: typeof Promise.resolve = Promise.resolve.bind(Promise);

interface ClientConfig<TServer extends QRServerMap, TCast extends QRCastMap> {
	clientImplementation: any;
	serverContract: TServer;
	cast: TCast;
}

interface ClientResult<TServer extends QRServerMap, TCast extends QRCastMap> {
	client: Client;
	server: TServer;
	cast: TCast;
	pendingRequestsChanged: TypedEvent<{ pending: string[] }>;
	connectionStatusChanged: TypedEvent<{ connected: boolean }>;
}
/** This is your main function to launch the client */
export function run<TServer extends QRServerMap, TCast extends QRCastMap>(config: ClientConfig<TServer, TCast>): ClientResult<TServer, TCast> {

	let client = new Client(config.clientImplementation);
	let server = client.sendAllToSocket(config.serverContract);
	let cast = client.setupAllCast<TCast>(config.cast);
	let pendingRequestsChanged = new TypedEvent<{ pending: string[] }>();
	client.pendingRequestsChanged = (pending) => {
		pendingRequestsChanged.emit({pending})
	};

	return {client, server, cast, pendingRequestsChanged, connectionStatusChanged: client.connectionStatusChanged};
}

export class Client extends RequesterResponder {
	public connectionStatusChanged = new TypedEvent<{ connected: boolean }>();
	protected getSocket = () => this.socket;
	private socket: SocketIOClient.Socket;
	private typedEvents: { [key: string]: TypedEvent<any> } = {};

	constructor(clientImplementation: any) {
		super();
		this.socket = io.connect(origin);

		// Also provide the following services to the server
		this.registerAllFunctionsExportedFromAsResponders(clientImplementation);
		this.startListening();

		this.socket.on(anycastMessageName, (msg: CastMessage<any>) => {
			this.typedEvents[msg.message].emit(msg.data);
		});

		let connected = false;
		setInterval(() => {
			let newConnected = this.socket.connected;
			if (newConnected != connected) {
				connected = newConnected;
				this.connectionStatusChanged.emit({connected});
			}
		}, 2000);
	}

	/**
	 * Each member of `instance` must be a typed event
	 * we wire these up to be emitted in the client if an emit is called on the server
	 */
	setupAllCast<T extends {[key:string]:TypedEvent<any>}>(instance: T): T {
		Object.keys(instance).forEach(name => {
			// Override the actual emit function with one that sends it on to the server
			this.typedEvents[name] = instance[name];
		});
		return instance;
	}
}
