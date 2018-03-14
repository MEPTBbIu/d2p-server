/** Will delete this some day */
export declare interface PromiseDeferred<T> {
  promise: Promise<T>;
  resolve(value: T): any;
  reject(error: T): any;
}

interface EditorPosition {
	line: number;
	ch: number;
}

interface CodeEdit {
	from: EditorPosition;
	to: EditorPosition;
	newText: string;
	/**
	 * When we are editing stuff from the front end we want all code edits except our own (user typing code)
	 * This helps us track that.
	 */
	sourceId? : string;
}

/** Our extensions to the Error object */
interface Error {
	/** Really useful to have for debugging */
	details?: any;
}

/**
 * Find and replace (FAR) related stuff
 */
interface FindOptions {
	isShown: boolean;
	query: string;
	isRegex: boolean;
	isCaseSensitive: boolean;
	isFullWord: boolean;
}


interface ReferenceDetails {
	filePath: string;
	position: EditorPosition;
	span: any;//ts.TextSpan;
}

interface Window {
    // A hack for the Redux DevTools Chrome extension.
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <F extends Function>(f: F) => F;
    __INITIAL_STATE__?: any;
    __data?:any;
}

interface ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
}


interface process {
    env: {
        NODE_ENV?: string|undefined;
    }
}

declare namespace Express {
    export interface Request<T = any>{
        client: any;
		io: NodeJS.EventEmitter|any;
        body: T;
    }
}
/*export function enumerable() {
    return (target: any, key: string) => {

        let pKey = '_' + key;

        // 1. Define hidden property
        Object.defineProperty(target, pKey, {
            value: 0,
            enumerable: false,
            configurable: true,
            writable: true
        });

        // 2. Override property get/set
        return Object.defineProperty(target, key, {
            enumerable: true,
            configurable: true,
            get: () => target[pKey],
            set: (val) => {
                target[pKey] = target[pKey] + 1;
            }
        });
    };
}     */
