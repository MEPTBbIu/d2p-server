"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const json_schema_to_typescript_1 = require("json-schema-to-typescript");
function generate() {
    return __awaiter(this, void 0, void 0, function* () {
        fs_1.writeFileSync('GSI_Model.d.ts', yield json_schema_to_typescript_1.compileFromFile('GSI_Model.schema.json'));
        fs_1.writeFileSync('GSI_Enums.d.ts', yield json_schema_to_typescript_1.compileFromFile('GSI_Enums.schema.json'));
    });
}
generate();
//# sourceMappingURL=index.js.map