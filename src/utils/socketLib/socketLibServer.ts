import http from 'http';
import https from 'https';
import * as socketIO from 'socket.io';
import {QRFunction, QRServerFunction,QRServerMap, QRClientMap, QRCastMap,anycastMessageName,  CastMessage,  RequesterResponder,  TypedEvent} from './socketLib';

export var resolve: typeof Promise.resolve = Promise.resolve.bind(Promise);


export interface RunConfig<TClient extends QRClientMap, TCast extends QRCastMap, TServer extends QRServerMap = QRServerMap> {
  app: http.Server | https.Server;
  serverImplementation: TServer;
  clientContract: TClient;
  cast: TCast
}

export interface ServerRunResult<TCast extends QRCastMap>{server: Server; cast: TCast;}
/** This is your main boot function for the server */
export function run<TClient extends QRClientMap, TCast extends QRCastMap, TServer extends QRServerMap = QRServerMap>(config: RunConfig<TClient, TCast, TServer>): ServerRunResult<TCast>
{

  let server = new Server(config.app,
    config.serverImplementation,
    (serverInstance: ServerInstance) => {
		  return serverInstance.sendAllToSocket(config.clientContract);
	});

	// Provide the server push messages
	let cast:TCast = server.setupAllCast<TCast>(config.cast);

	return {server: server, cast: cast};
}


export class Server {
	io: SocketIO.Server;

	constructor(private app: http.Server | https.Server, serverImplementation: QRServerMap, clientCreator: (socket: ServerInstance) => any) {
		this.io = socketIO(app
			// polling is more available on hosts (e.g. azure) but it causes more socket hangups in socketIO
			/* ,{transports:['polling']} */
		);
		this.io.on('connection', (socket) => {
			let serverInstance = new ServerInstance(socket, serverImplementation);
			serverInstance.client = clientCreator(serverInstance);
		});
	}

	/**
	 * Mutates the original in place plus returns the mutated version
	 * Each member of `instance` must be a typed event
	 */
	setupAllCast<T extends QRCastMap>(instance: T): T {
		var toRet = instance;
		Object.keys(toRet).forEach(name => {
			// Override the actual emit function with one that sends it on to the server
			const evt = new TypedEvent<T>();
			toRet[name] = evt;
			evt.on((data: T) => {
				let castMessage: CastMessage<T> = {
					message: name,
					data: data
				};
				// console.log('EMIT TO ALL : ', name)
				this.io.sockets.emit(anycastMessageName, castMessage);
			});
		});
		return toRet;
	}
}

export class ServerInstance extends RequesterResponder {
	protected getSocket = () => this.socket;

	constructor(private socket: SocketIO.Socket, responderModule: any) {
		super();
		this.registerAllFunctionsExportedFromAsResponders(responderModule);
		super.startListening();
	}
}
