'esversion: es6';
const writeFileSync = require('fs');
const compileFromFile = require('json-schema-to-typescript');

async function generate() {
	writeFileSync('..\\GSI_Model.d.ts', await compileFromFile('E:\\dev\\d2p-server\\src\\model\\schema\\GSI_Model.schema.json'))
}

generate();