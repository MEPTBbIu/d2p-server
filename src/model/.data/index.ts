import { writeFileSync } from 'fs';
import {compileFromFile} from 'json-schema-to-typescript';

async function generate() {
	writeFileSync('GSI_Model.d.ts',
		await compileFromFile('GSI_Model.schema.json'))
	writeFileSync('GSI_Enums.d.ts',
		await compileFromFile('GSI_Enums.schema.json'))
}

generate();