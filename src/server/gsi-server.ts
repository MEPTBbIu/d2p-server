import * as bodyParser from 'body-parser';
import  express from "express";

import * as serverStatic from 'express-serve-static-core';
const SocketIO = require('socket.io');
import {GSI} from '../model/GSI.Model';
// import {EventEmitter} from 'events';


export interface Request<T> extends serverStatic.Request {
		client: GSIServer.ClientInfo;
		io: NodeJS.EventEmitter;
		body: T;
}

export namespace GSIServer {
	 export interface ClientInfo {
		ip: string;
		auth: GSI.Auth | string;
		gamestate: GSI.GameState;
	}

  // function ClientInfo(ip: string, auth: GSI.Auth | string , state: GSI.GameState): ClientInfo;

	// var clients: Array<GSIServer.ClientInfo>;
	export interface ServerOptions {
		port?: number
		tokens?: string[]
		ip?: string
	}
}

 export class GSIServer  {
    static clients: Array<GSIServer.ClientInfo> = [];
    static ClientInfo(ip: string, auth: GSI.Auth | string, state: GSI.GameState):GSIServer.ClientInfo  {
    return {
      ip: ip, auth: auth, gamestate: state
    };
  }
		port: number;
		tokens: string[] | string;
		ip: string;
		app: express.Application;
		io: SocketIO.Server;
		server: any;

		constructor(options: GSIServer.ServerOptions = {}) {

			this.port = options.port || 3000;
			this.tokens = options.tokens || "";
			this.ip = options.ip || "0.0.0.0";

			this.app = express();
			this.app.use(bodyParser.json());
			this.app.use(bodyParser.urlencoded({extended: true}));

			this.io = SocketIO();
			this.app.use((req: any, res?: express.Response, next?: express.NextFunction) => {
				req.io = this.io;
				next && next();
			});

			this.app.post('/',
				this.checkAuth(this.tokens),
				this.checkClient,
				this.updateGameState,
				this.processChanges('previously'),
				this.processChanges(/*'added'*/ 'abilities'),
				this.newData);

			this.server = this.app.listen(this.port, this.ip, () => {
				console.log('Dota 2 GSI listening on port ' + this.server.address().port);
			});

			this.io.attach(this.server);

			// New connection or reconnection
			this.io.on('connection', (socket) => {
				console.log("A user connected by socket!");
				console.log("Socket ID is", socket.id);
			});

			return this;
		}

		 checkClient(req: Request<GSI.GameState>, res: express.Response, next?: express.NextFunction) {
			let clients = GSIServer.clients;

			// Check if this IP is already talking to us
			for (let i = 0; i < clients.length; i++) {
				if (clients[i].ip == req.ip) {
					req.client = clients[i];
					next && next();
				}
			}
			// Create a new client
			let client = GSIServer.ClientInfo(req.ip, req.body.auth, req.body);

			clients.push(client);
			req.client = client;
			//req.client.gamestate = req.body;

			// Notify about the new client
			req.io.emit('newclient', client);
			console.log("msg: ", JSON.stringify(client.gamestate));
			next && next();
		}

		updateGameState(req: Request<GSI.GameState>, res: express.Response, next?: express.NextFunction) {
			req.client.gamestate = req.body;
			next && next();
		}

		newData(req: Request<GSI.GameState>, res: express.Response) {
			req.io.emit('newdata', req.body);
			res.end();
		}

		emitAll(prefix: string, obj: any, emitter: NodeJS.EventEmitter) {
			Object.keys(obj).forEach((key) => {
				// For scanning keys and testing
				// emitter.emit("key", ""+prefix+key);
				// console.log("Emitting '"+prefix+key+"' - " + obj[key]);
				emitter.emit(prefix + key, obj[key]);
			});
		}

		recursiveEmit(prefix: string, changed: any, body: any, emitter: NodeJS.EventEmitter) {
			Object.keys(changed).forEach((key) => {
				if (typeof(changed[key]) == 'object') {
					if (body[key] !== null) { // safety check
						this.recursiveEmit(prefix + key + ":", changed[key], body[key], emitter);
					}
				} else {
					// Got a key
					if (body[key] !== null) {
						if (typeof body[key] == 'object') {
							// Edge case on added:item/ability:x where added shows true at the top level
							// and doesn't contain each of the child keys
							this.emitAll(prefix + key + ":", body[key], emitter);
						} else {
							// For scanning keys and testing
							// emitter.emit("key", ""+prefix+key);
							// console.log("Emitting '"+prefix+key+"' - " + body[key]);
							emitter.emit(prefix + key, body[key]);
						}
					}
				}
			});
		}

		processChanges(section: keyof GSI.GameState) {
			return (req: Request<GSI.GameState>, res: express.Response, next?: express.NextFunction) => {
				if (req.body && req.body[section]) {
					// console.log("Starting recursive emit for '" + section + "'");
					this.recursiveEmit("", req.body[section], req.body, req.io);
				}
				next && next();
			}
		}

		checkAuth(tokens: string | Array<string>):express.RequestHandler {
			return (req:any, res: express.Response, next?: express.NextFunction) => {
				if (tokens && req.body.auth) {
					if (typeof tokens === "string" && req.body.auth && req.body.auth.token == tokens) // tokens was a single string or
					{ // containing the token
						next && next();
					}
					else if (typeof tokens === "object" && tokens.constructor === Array && req.body.auth.token && // tokens was an array and
						tokens.indexOf(req.body.auth.token) != -1) {
						next && next();
					}
					else {
						// Not a valid auth, drop the message
						console.log("Dropping message from IP: " + req.ip + ", no valid auth token");
						res.end();
					}
				}
				else {
					next && next();
				}
			}

		}
	}
export default GSIServer;