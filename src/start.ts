//import * as _server from "./server/socket/socketServer";


//import * as ClientIO from 'socket.io-client';
//import * as ServerIO from 'socket.io';
import * as bodyParser from 'body-parser';
import {Request as ESSRequest, Response} from "express-serve-static-core";

import * as express from "express";

import {GSI} from "./model/GSI.Model";
import {Types, cast} from "./server/socket/socketContract";
import {ServerRunResult} from "./utils/socketLib/socketLibServer";
//import GSIServer from "./server/gsi-server";




var dotaClients:{[key:string]:Types.DotaClientInfo}&Object = {};

export interface Request<T> extends ESSRequest {
    dotaClient: Types.DotaClientInfo;
   // cast: typeof cast;
    body: T;
    srv: ServerRunResult<typeof cast>;
}

interface ServerOptions {
    port?: number;
    tokens?: string[]|string;
    ip?: string;
}

function setupServer(options:ServerOptions = {}): ServerOptions{
    return {
        port : options.port || 3000,
        tokens : options.tokens || "",
        ip: options.ip || "0.0.0.0" };
}

function checkClient(req: Request<GSI.GameState>, res: express.Response, next?: express.NextFunction) {
   // let clients = clients;
  // let dotaClient:Types.DotaClientInfo = null;
    // Check if this IP is already talking to us
    //for (let i = 0; i < clients.length; i++) {
        req.dotaClient = dotaClients[req.ip];
      //  if (dotaClients[req.ip]) {
      //      req.dotaClient = dotaClients[req.ip];
         //   next && next();
         //   break;
     //   }
   // }

    if(!req.dotaClient) {
        req.dotaClient =  {
            ip:req.ip,
            auth: req.body.auth || {token:""},
            gamestate: {...req.body}
        };
        dotaClients[req.ip] = req.dotaClient;
        console.log("checkClient: new", JSON.stringify(req.dotaClient.ip));
        cast.hello.emit(req.dotaClient);
    }
    // Create a new client
    next && next();
}  

   

    // Notify about the new client


 


function newData(req: Request<GSI.GameState>, res: Response) {
   req.srv.cast.updateState.emit(req.body);
   // var event = new typeof cast.newGameState();
    //cast.newGameState.emit(req.body);
    res.end();
}

const options = setupServer();

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//export var serverIO = ServerIO();

app.use((req: Request<GSI.GameState>, res?: express.Response, next?: express.NextFunction) => {
   // console.log("register server IO");
   // var srvReg  = ioRegister;

    req.srv = ioRegister;
    next && next();
});

app.post('/',
    checkClient,
    newData);

var httpServer = app.listen(options.port, options.ip, () => {
    console.log('Dota 2 GSI listening on port ' + httpServer.address().port);
});

// Setup a socket server
import {register} from "./server/socket/socketServer";
var ioRegister = register(httpServer);

import * as _client from "./server/socket/socketClient";
var cln_io = {..._client};
//var cln_cast = cln_io.cast;
//serverIO.attach(httpServer);

// New connection or reconnection
//this.io.on('connection', (socket) => {
 //   console.log("A user connected by socket!");
//    console.log("Socket ID is", socket.id);
//});

