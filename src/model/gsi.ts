// tslint:disable:no-empty-interface
export namespace GSI {

	/** Enum list for each Game State */
	export enum GameRulesState {


		/** Disconnected */
		DOTA_GAMERULES_STATE_DISCONNECT = "DOTA_GAMERULES_STATE_DISCONNECT",
		/** Game is in progress */
		DOTA_GAMERULES_STATE_GAME_IN_PROGRESS = "DOTA_GAMERULES_STATE_GAME_IN_PROGRESS",
		/** Players are currently selecting heroes */
		DOTA_GAMERULES_STATE_HERO_SELECTION = "DOTA_GAMERULES_STATE_HERO_SELECTION",
		/** Game is starting */
		DOTA_GAMERULES_STATE_INIT = "DOTA_GAMERULES_STATE_INIT",
		/** Game is ending */
		DOTA_GAMERULES_STATE_LAST = "DOTA_GAMERULES_STATE_LAST",
		/** Game has ended, post game scoreboard */
		DOTA_GAMERULES_STATE_POST_GAME = "DOTA_GAMERULES_STATE_POST_GAME",
		/** Game has started, pre game preparations */
		DOTA_GAMERULES_STATE_PRE_GAME = "DOTA_GAMERULES_STATE_PRE_GAME",
		/** Players are selecting/banning heroes */
		DOTA_GAMERULES_STATE_STRATEGY_TIME = "DOTA_GAMERULES_STATE_STRATEGY_TIME",
		/** Waiting for everyone to connect and load */
		DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD = "DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD",
		/** Game is a custom game */
		DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP = "DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP",

		DOTA_GAMERULES_STATE_TEAM_SHOWCASE = "DOTA_GAMERULES_STATE_TEAM_SHOWCASE",

		DOTA_GAMERULES_STATE_WAIT_FOR_MAP_TO_LOAD = "DOTA_GAMERULES_STATE_WAIT_FOR_MAP_TO_LOAD"

	}

	type KeyDotaGameState = keyof typeof GameRulesState;

	/** Enum list for each player team */
	export enum EPlayerTeam {

		/** No team */
		none = "none",
		/** Dire team */
		dire = "dire",
		/** Radiant team */
		radiant = "radiant"
	}

	/** Enum for various player activities */
	export enum EPlayerActivity {
		/** In a menu */
		menu = "menu",
		/** In a game */
		playing = "playing"
	}

	/** Class representing information about the map */
	export interface Map {
		clock_time?: number;
		customgamename?: string;
		daytime?: boolean;
		game_state?: GameRulesState; //	"$ref": "#/definitions/GSI_GameRulesState"
		game_time?: number;
		matchid?: number;
		name?: string;
		nightstalker_night?: boolean;
		paused?: boolean;
		ward_purchase_cooldown?: number;
		win_team?: EPlayerTeam; //	"$ref": "#/definitions/GSI_PlayerTeam"
	}

	/** Class representing item information */
	export interface DotaItem {
		name?: string;
		contains_rune?: boolean;
		can_cast?: boolean;
		cooldown?: number;
		passive?: any;
		charges?: number;
	}

	/** A class representing the authentication information for GSI */
	export interface Auth {
	}

	/** Class representing ability information */
	export interface Ability {
		name?: any;
		level?: any;
		can_cast?: any;
		passive?: any;
		ability_active?: any;
		cooldown?: any;
		ultimate?: any;
	}

	/** Class representing hero abilities */
	export interface Abilities {
		/** The number of abilities */
		count: number;
		/** Gets the ability at a specified index */
		this: { [key: number]: Ability };
	}

	/** Class representing item information */
	export interface DotaItems {
		/** Number of items in the inventory */
		countInventory: number;
		/** Gets the IEnumerable of the inventory items */
		inventory: DotaItem[];
		/** Number of items in the stash */
		countStash: number;
		/** Gets the IEnumerable of the stash items */
		stash: DotaItem[];
	}

	/** Class representing hero information */
	export interface Hero {
		id?: string;
		name?: string;
		level?: number;
		alive?: boolean;
		respawn_seconds?: number;
		buyback_cost?: number;
		buyback_cooldown?: number;
		health?: number;
		max_health?: number;
		health_percent?: any;
		mana?: number;
		max_mana?: number;
		mana_percent?: any;
		silenced?: boolean;
		stunned?: boolean;
		disarmed?: boolean;
		magicimmune?: any;
		hexed?: boolean;
		muted?: boolean;
		break?: any;
		has_debuff?: boolean;
	}

	/** Class representing ability attributes */
	export interface Attributes {
		[key: string]: any;
	}

	/** Class representing player information */
	export interface Player {
		steamid?: any;
		name?: string;
		activity?: any;
		kills?: number;
		deaths?: number;
		assists?: number;
		last_hits?: number;
		denies?: number;
		kill_streak?: number;
		team_name?: string;
		gold?: number;
		gold_reliable?: number;
		gold_unreliable?: number;
		gpm?: number;
		xpm?: number;
	}

	/** Information about the provider of this GameState */
	export interface Provider {
		name?: string;
		appid?: number;
		version?: number;
		timestamp?: number;
	}

	/** A class representing various information retaining to Game State Integration of Dota 2 */
	export interface GameState {
		/** Information about GSI authentication */
		auth?: Auth;
		/** Information about the provider of this GameState */
		provider?: Provider;
		/** Information about the current map */
		map?: Map;
		/** Information about the local player */
		player?: Player;
		/** Information about the local player's hero */
		hero?: Hero;
		/** Information about the local player's hero abilities */
		abilities?: Abilities;
		/** Information about the local player's hero items */
		items?: DotaItems;
		/** A previous GameState */
		previously?: Partial<GameState> | null;

//	"abilities": { "$ref": "#/definitions/GSI_HeroAbilities" },
//	"auth": { "$ref": "#/definitions/GSI_Auth" },
//	"hero": { "$ref": "#/definitions/GSI_Hero" },
//	"items": { "$ref": "#/definitions/GSI_PlayerItems" },
//	"map": { "$ref": "#/definitions/GSI_Map" },
//	"player": { "$ref": "#/definitions/GSI_Player" },
//	"previously": { "$ref": "#/definitions/GSI_PreviousGameState" },
//	"provider": { "$ref": "#/definitions/GSI_Provider" },
		draft?: any,
		wearables?: any,
		buildings?: any

	}

	/**
	 * Слушатель GIS сообщений
	 *
	 * @export interface GameStateListener
	 */
	export interface GameStateListener {
		currentGameState: GameState;
		/** Gets the port that is being listened */
		port: number;
		/** Returns whether or not the listener is running */
		running: boolean;
	}
}

//export default  GSI ;