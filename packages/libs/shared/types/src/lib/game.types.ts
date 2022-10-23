import { GameInfo } from "@ft-transcendence/libs/shared/game";
import { Lobby } from "../../../../../libs/backend/game/src/lib/lobby";
import { MatchDto } from "./match.types";

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

export enum ClientEvents
{
	EnterMatchMaking = 'client.entermatchmaking',
	GameInput = 'client.gameinput',
	CreateRoom = 'client.createroom',
	JoinRoom = 'client.joinroom',
	SpectateGame = 'client.spectate',
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
		result: MatchDto;
	  };

	[ServerEvents.LobbyList]: {
		lobbies: Array<SpectateInfo>;
	  };
  };