import * as slc from "../../utils/socketLib/socketLibClient";
import * as contract from "./socketContract";
// import {Types} from "./socketContract";
//import client = contract.client;
export import Types = contract.Types;

namespace Client {
    export var increment: typeof contract.client.increment = (q) => {
        return Promise.resolve({
            num: ++q.num
        });
    }

    export const updateState:typeof contract.client.updateState = (state) => {
        console.log("Client-> updateState:", JSON.stringify(state));
        return Promise.resolve({});
    }
   /* export const newDotaClient: typeof contract.client.newDotaClient = (dotaClient) =>{
        console.log("client-> newDotaClient:", JSON.stringify(dotaClient));
        return Promise.resolve({});
    }*/
}

// Ensure that the namespace follows the contract
var _checkTypes: typeof contract.client = Client;
// launch client
export let {
    server,
    cast,
    pendingRequestsChanged,
    connectionStatusChanged
} = slc.run({ clientImplementation: Client, serverContract: contract.server, cast: contract.cast });

// Sample usage
cast.hello.on((p) => { console.log("hello",JSON.stringify(p) )});
/*cast.newGameState.on((state)=>{
    console.log("newGameState",JSON.stringify(state));
})*/
/*cast.newDotaClient.on( (dotaClient) =>{
    console.log("client-> newDotaClient:", JSON.stringify(dotaClient));
   // return Promise.resolve({});
});*/
