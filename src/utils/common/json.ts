import * as types from './types';
import * as ts from "typescript";

export interface ParsedData<T> {
    /** only if valid */
    data?: T;
    /** only if error */
    error?: ParseError;
}

/**
   * Remove the comments from a json like text.
   * Comments can be single line comments (starting with # or //) or multiline comments using / * * /
   *
   * This method replace comment content by whitespace rather than completely remove them to keep positions in json parsing error reporting accurate.
   */
function removeComments(jsonText: string): string {
    let output = "";
    const scanner = ts.createScanner(ts.ScriptTarget.ES5, /* skipTrivia */ false, ts.LanguageVariant.Standard, jsonText);
    let token: ts.SyntaxKind;
    while ((token = scanner.scan()) !== ts.SyntaxKind.EndOfFileToken) {
        switch (token) {
            case ts.SyntaxKind.SingleLineCommentTrivia:
            case ts.SyntaxKind.MultiLineCommentTrivia:
                // replace comments with whitespace to preserve original character positions
                output += scanner.getTokenText().replace(/\S/g, " ");
                break;
            default:
                output += scanner.getTokenText();
                break;
        }
    }
    return output;
}

/**
 * Over JSON.parse:
 * * allows BOM
 * * allows // /* # comments
 * * provides a typed error detail on parse error
 */
export function parse<T>(str: string): ParsedData<T> {
    const content = removeComments(stripBOM(str));

    try {
        return { data: json_parse(content) };
    }
    catch (e) {
        let error: { message: string; at: number } = e;

        const indexToPosition = (index: number): { line: number, ch: number } => {
            let beforeLines = splitlines(content.substr(0, index));
            return {
                line: Math.max(beforeLines.length - 1, 0),
                ch: Math.max(beforeLines[beforeLines.length - 1].length - 1, 0)
            };
        }

        let fromIndex = Math.max(error.at - 1, 0);
        let toIndex = Math.min(error.at + 1, content.length);

        return {
            error: {
                message: e.message,
                from: indexToPosition(fromIndex),
                to: indexToPosition(toIndex),
                preview: content.substring(fromIndex, toIndex - 1)
            }
        }
    }
}

export function stringify(object: Object, eol: string = '\n'): string {
    var cache:any = [];
    var value = JSON.stringify(object,
        // fixup circular reference
        function(_key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        },
        // indent 2 spaces
        2);
    value = value.split('\n').join(eol) + eol;
    cache=null;
    return value;
}

function stripBOM(str: string) {
    // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
    // conversion translates it to FEFF (UTF-16 BOM)
    if (typeof str === 'string' && str.charCodeAt(0) === 0xFEFF) {
        return str.slice(1);
    }
    return str;
}

function splitlines(string: string) { return string.split(/\r\n?|\n/); };


export interface ParseError {
    message: string;
    preview: string;
    from: {
        /** zero based */
        line: number;
        /** zero based */
        ch: number
    };
    to: {
        /** zero based */
        line: number;
        /** zero based */
        ch: number
    };
}

/**
 * https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js
 * AS IT IS. ONLY MODIFIED WITH TYPE ASSERTSIONS / ANNOTATIONS
 */
var json_parse: any = (function() {
    "use strict";

    // This is a function that can parse a JSON text, producing a JavaScript
    // data structure. It is a simple, recursive descent parser. It does not use
    // eval or regular expressions, so it can be used as a model for implementing
    // a JSON parser in other languages.

    // We are defining the function inside of another function to avoid creating
    // global variables.

    var at:number,     // The index of the current character
        ch:string,     // The current character
        escapee:{[ch:string]:any} = {
            '"': '"',
            '\\': '\\',
            '/': '/',
            b: '\b',
            f: '\f',
            n: '\n',
            r: '\r',
            t: '\t'
        },
        text:string,

        error = (m:string) => {

            // Call error when something is wrong.

            throw {
                name: 'SyntaxError',
                message: m,
                at: at,
                text: text
            };
        },

        next = (c?:string) => {

            // If a c parameter is provided, verify that it matches the current character.

            if (c && c !== ch) {
                error("Expected '" + c + "' instead of '" + ch + "'");
            }

            // Get the next character. When there are no more characters,
            // return the empty string.

            ch = text.charAt(at);
            at += 1;
            return ch;
        },
        _minus = `-`,
        _plus = `+`,
        number = () => {

            // Parse a number value.

            var number,
                string = '';

            if (ch === '-') {
                string = '-';
                next('-');
            }
            while (ch >= '0' && ch <= '9') {
                string += ch;
                next();
            }
            if (ch === '.') {
                string += '.';
                while (next() && ch >= '0' && ch <= '9') {
                    string += ch;
                }
            }
            if (ch === `E` || ch === `e` ) {
                string += ch;
                next();
                if (ch ===  _minus || ch === _plus) {
                    string += ch;
                    next();
                }
                while (ch >= '0' && ch <= '9') {
                    string += ch;
                    next();
                }
            }
            number = +string;
            if (!isFinite(number)) {
                error("Bad number");
            } else {
                return number;
            }
        },

        string = ()=> {

            // Parse a string value.

            var hex,
                i,
                string = '',
                uffff;

            // When parsing for string values, we must look for " and \ characters.

            if (ch === '"') {
                while (next()) {
                    if (ch === '"') {
                        next();
                        return string;
                    }
                    if (ch === '\\') {
                        next();
                        if (ch === 'u') {
                            uffff = 0;
                            for (i = 0; i < 4; i += 1) {
                                hex = parseInt(next(), 16);
                                if (!isFinite(hex)) {
                                    break;
                                }
                                uffff = uffff * 16 + hex;
                            }
                            string += String.fromCharCode(uffff);
                        } else if (typeof escapee[ch] === 'string') {
                            string += escapee[ch];
                        } else {
                            break;
                        }
                    } else {
                        string += ch;
                    }
                }
            }
            error("Bad string");
        },

        white = function() {

            // Skip whitespace.

            while (ch && ch <= ' ') {
                next();
            }
        },

        word = ()=> {

            // true, false, or null.

            switch (ch) {
                case 't':
                    next('t');
                    next('r');
                    next('u');
                    next('e');
                    return true;
                case 'f':
                    next('f');
                    next('a');
                    next('l');
                    next('s');
                    next('e');
                    return false;
                case 'n':
                    next('n');
                    next('u');
                    next('l');
                    next('l');
                    return null;
            }
            error("Unexpected '" + ch + "'");
        },

        value:any,  // Place holder for the value function.

        array = () => {

            // Parse an array value.

            var array:any = [],
            _rb = `]`,
            _lb = `[`;

            if (ch === `[`) {
                next('[');
                white();
                if (ch === _rb) {
                    next(']');
                    return array;   // empty array
                }
                while (ch) {
                    array.push(value());
                    white();
                    if (ch === _lb) {
                        next(']');
                        return array;
                    }
                    next(',');
                    white();
                }
            }
            error("Bad array");
        },

        object = function() {

            // Parse an object value.

            var key:any,
                object:{[key:string]:any} = {},
                _rb = `}`,
                _lb = `{`;


            if (ch === '{') {
                next('{');
                white();
                if (ch === _rb) {
                    next('}');
                    return object;   // empty object
                }
                while (ch) {
                    key =  string();
                    white();
                    next(':');
                    if (Object.hasOwnProperty.call(object, key)) {
                        error('Duplicate key "' + key + '"');
                    }
                    object[key] = value();
                    white();
                    if (ch === _lb) {
                        next('}');
                        return object;
                    }
                    next(',');
                    white();
                }
            }
            error("Bad object");
        };

    value = function() {

        // Parse a JSON value. It could be an object, an array, a string, a number,
        // or a word.

        white();
        switch (ch) {
            case '{':
                return object();
            case '[':
                return array();
            case '"':
                return string();
            case '-':
                return number();
            default:
                return ch >= '0' && ch <= '9'
                    ? number()
                    : word();
        }
    };

    // Return the json_parse function. It will have access to all of the above
    // functions and variables.

    return (source:string, reviver?:(holder:{[key:string]:any}, key:string, value: any)=>any) => {
        var result;

        text = source;
        at = 0;
        ch = ' ';
        result = value();
        white();
        if (ch) {
            error("Syntax error");
        }

        // If there is a reviver function, we recursively walk the new structure,
        // passing each name/value pair to the reviver function for possible
        // transformation, starting with a temporary root object that holds the result
        // in an empty key. If there is not a reviver function, we simply return the
        // result.

        return typeof reviver === 'function'
            ? (function walk(holder:{[key:string]:any}, key:string) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }({ '': result }, ''))
            : result;
    };
}());
