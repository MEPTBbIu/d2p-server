/**
 * Its Types (e.g. enums) + constants :)
 */


export enum TriState {
    Unknown,
    True,
    False,
}

export const errors = {
    CALLED_WHEN_NO_ACTIVE_PROJECT_FOR_FILE_PATH: "A query *that needs an active project* was made when there is no active project for given filePath",
    CALLED_WHEN_NO_ACTIVE_PROJECT_GLOBAL: "A query *that needs an active project* was made when there is no active project"
}

/**
 * Some session constants
 */
/** When a new server stats up */
export const urlHashNormal = "root";
/** When user requests a new window */
export const urlHashNewSession = "new-session";
/** When alm is started ni debug mode */
export const urlHashDebugSession = "debug";

/**
 * FARM : Don't want to crash by running out of memory / ui preference
 */
export const maxCountFindAndReplaceMultiResults = 1000;


/**
 * Project JS File status stuff
 */
export interface JSOutputStatus {
    /** Its convinient to have it hare */
    inputFilePath: string;

    /** One of the various states */
    state: JSOutputState;

    /** Only if the state is for some JS file */
    outputFilePath?: string;
}
/** The JS file can only be in one of these states */
export enum JSOutputState {
    /** If emit skipped (Either emit is blocked or compiler options are noEmit) or perhaps there isn't a JS file emit for this (e.g .d.ts files) */
    NoJSFile = 1,
    /** If JS file then its one of these */
    JSUpToDate,
    JSOutOfDate,
}
export type JSOutputStatusCache = { [inputFilePath: string]: JSOutputStatus }
export type LiveBuildResults = {
    builtCount: number;
    totalCount: number;
}
/** Query response for individual file query */
export type GetJSOutputStatusResponse = {
    inActiveProject: boolean,
    /** Only present if the file as in active project */
    outputStatus?: JSOutputStatus
};

/**
 * Complete related stuff
 */


/**
 * These are the projects that the user can select from.
 * Just the name and config path really
 */
export interface AvailableProjectConfig {
    name: string;
    /** Virtual projects are projects rooted at some `.ts`/`.js` file */
    isVirtual: boolean;
    /** If the project is virtual than this will point to a `.ts`/`.js` file */
    tsconfigFilePath: string;
}

/**
 * Project Data : the config file + all the file path contents
 */
export interface FilePathWithContent {
    filePath: string;
    contents: string;
}
export interface ProjectDataLoaded {
    configFile: TypeScriptConfigFileDetails;
    filePathWithContents: FilePathWithContent[];
}

/**
 * Our analysis of stuff we want from package.json
 */
export interface PackageJsonParsed {
    /** We need this as this is the name the user is going to import **/
    name: string;
    /** we need this to figure out the basePath (will depend on how `outDir` is relative to this directory) */
    directory: string;
    /** This is going to be typescript.definition */
    definition: string;
    main: string;
}

/**
 * This is `TypeScriptProjectRawSpecification` parsed further
 * Designed for use throughout out code base
 */
export interface TsconfigJsonParsed {
    //compilerOptions: ts.CompilerOptions;
    files: string[];
    typings: string[]; // These are considered externs for .d.ts. Note : duplicated in files
   // formatCodeOptions: ts.FormatCodeOptions;
    compileOnSave: boolean;
    buildOnSave: boolean;
    package?: PackageJsonParsed;
}

export interface TypeScriptConfigFileDetails {
    /** The path to the project file. This acts as the baseDIR */
    projectFileDirectory: string;
    /** The actual path of the project file (including tsconfig.json) or srcFile if `inMemory` is true */
    projectFilePath: string;
    project: TsconfigJsonParsed;
    inMemory: boolean;
}

/**
 * Errors
 */
export enum ErrorsDisplayMode {
    all = 1,
    openFiles = 2,
}


/**
 * The TypeDoc icons a pretty expansive 🌹 with a few ideas that I disagree with / or think are too difficult.
 * E.g the type `event`. The "grey" coloring of the global functions. The following is a simpler subset.
 *
 * Places that need to be kept in sync:
 * - typeIcon.tsx: the location in typeIcons.svg
 * - the legend component
 * - the server responses
 */
export enum IconType {
    /**
     * There can be only one global
     * Any of the remaining things can be either in a module or global
     */
    Global,

    Namespace, // same for module
    Variable,
    Function,
    FunctionGeneric,

    Enum,
    EnumMember,

    Interface,
    InterfaceGeneric,
    InterfaceConstructor,
    InterfaceProperty,
    InterfaceMethod,
    InterfaceMethodGeneric,
    InterfaceIndexSignature,

    Class,
    ClassGeneric,
    ClassConstructor,
    ClassProperty,
    ClassMethod,
    ClassMethodGeneric,
    ClassIndexSignature,
}



/**
 * When a worker is *working* it can send us a message
 */
export type Working = {
    working: boolean
}