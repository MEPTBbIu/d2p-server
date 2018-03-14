
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
