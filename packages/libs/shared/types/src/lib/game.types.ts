import { GameInfo } from "@ft-transcendence/libs/shared/game";
import { MatchDto } from "./match.types";
import { Paddle, Ball } from '@ft-transcendence/libs/shared/game'

export type PlayersName = {
	left: string;
	right: string;
};

export type ScoreGame = {
	left: number;
	right: number;
};

export type SpectateInfo = {
	left: string;
	right: string;
	game_mode: 'simple' | 'double';
	id: string;
};

export type GameData = {
	paddle_a: Paddle;
	paddle_b: Paddle;
	player_a_score: number;
	player_b_score: number;
	players_name: PlayersName;
	ball: Array<Ball>;
	has_ended: boolean;
	has_started: boolean;
}

export enum ClientEvents
{
	EnterMatchMaking = 'client.entermatchmaking',
	GameInput = 'client.gameinput',
	CreateRoom = 'client.createroom',
	JoinRoom = 'client.joinroom',
	SpectateGame = 'client.spectate',
	LeaveRoom = 'client.leaveroom',
	LobbyList = 'client.lobbylist',
	PlayerList = 'client.playerlist',
	LobbyInvite = 'client.lobbyinvite',
	AcceptInvite = 'client.acceptinvite',
	CancelInvite = 'client.cancelinvite',
}

export enum ServerEvents
{
	GameMessage = 'server.message',
	GameInfo = 'server.gameinfo',
	GameStart = 'server.gamestart',
	GameEnd = 'server.gameend',
	LobbyJoined = 'server.lobbyjoined',
	LobbyCreated = 'server.lobbycreated',
	LobbyList =  'server.lobbylist',
	PlayerList = 'server.playerlist',
	LobbyInvite = 'server.lobbyinvite',
	DoubleLog = 'server.doublelog',

}

export type ServerPayloads = {
	[ServerEvents.GameMessage]: {
	  message: string;
	};

	[ServerEvents.LobbyJoined]: {
		message: string;
	  };

	[ServerEvents.LobbyCreated]: {
		message: string;
		lobbyId: number;
	  };

	[ServerEvents.GameInfo]: {
		info: GameData;
	  };

	[ServerEvents.GameStart]: {
		message: string;
	  };

	[ServerEvents.GameEnd]: {
		result: MatchDto;
	  };

	[ServerEvents.PlayerList]: {
		players: Array<string>
	  };

	[ServerEvents.LobbyList]: {
		lobbies: Array<SpectateInfo>;
	  };
	
  };