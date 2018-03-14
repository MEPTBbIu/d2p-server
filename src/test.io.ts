import  GSI  from "./model";
import { GSIServer } from "./server";
//import * as io from 'socket.io-client';
const io = require('socket.io-client');
var server = new GSIServer();

// Connect to the socket
var socket = io('http://localhost:3000');

socket.on('newclient', (client: GSIServer.ClientInfo) => {
    console.log("New client connection, IP address: " + client.ip);
   if (client.auth ) {
        console.log("Auth token: " + client.auth);
    } else {
        console.log("No Auth token");
    }
});

socket.on('draft:activeteam', (msg:any) => {
    console.log("The active team drafting has changed to " + msg);
});

socket.on('hero:team2:player0:alive', (isAlive:boolean) => {
    if (isAlive) {
        console.log("Player 0 has respawned");
    } else {
        console.log("Player 0 has been killed!");
    }
});

socket.on('player:activity', function(activity:string) {
    if (activity == 'playing') console.log("Game started!");
});
socket.on('hero:level', (level:number) => {
    console.log("Now level " + level);
});
socket.on('abilities:ability0:can_cast', function(can_cast:boolean) {
    if (can_cast) console.log("Ability0 off cooldown!");
});