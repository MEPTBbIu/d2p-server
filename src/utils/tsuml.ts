import {TypeScriptUml}  from "typescript-uml";

//const uml = require("typescript-uml");
import * as  path from "path";

const rootPath = path.resolve(__dirname, "..\\");

//
const mdl =  TypeScriptUml.parseProject(rootPath);/*,{
	include:[
		"src/**.ts?"
	],
	exclude: [
		"node_modules",
		"build",
		"temp",
		"data",
		"dist",
		"typings/main",
		"typings/main.d.ts"
	  ],
	//  tsconfig:rootPath
});*/

const nodes = mdl.nodes.values();
console.table(nodes);
const diagram = TypeScriptUml.generateClassDiagram(mdl);