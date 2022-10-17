import { GameInfo } from "@ft-transcendence/libs/shared/game";
import { Lobby } from "../../../../../libs/backend/game/src/lib/lobby";

export type PlayersName = {
	left: string;
	right: string;
};

export type ScoreGame = {
	left: number;
	right: number;
};

export enum ClientEvents
{
	EnterMatchMaking = 'client.entermatchmaking',
	GameInput = 'client.gameinput',
	CreateRoom = 'client.createroom',
	JoinRoom = 'client.joinroom',
	LeaveRoom = 'client.leaveroom',
	LobbyList = 'client.lobbylist'
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
}

export type ResultGame = {
	winner: string;
	loser: string;
	score: ScoreGame;
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
		info: GameInfo;
	  };

	[ServerEvents.GameStart]: {
		message: string;
	  };

	[ServerEvents.GameEnd]: {
		result: ResultGame;
	  };

	[ServerEvents.LobbyList]: {
		lobbies: Map<Lobby['id'], Lobby>;
	  };
  };