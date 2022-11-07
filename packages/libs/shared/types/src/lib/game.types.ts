import { GameInfo } from "@ft-transcendence/libs/shared/game";
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
	LobbyList = 'client.lobbylist',
	PlayerList = 'client.playerlist',
	LobbyInvite = 'client.lobbyinvite',
	AcceptInvite = 'client.acceptinvite',
	CancelInvite = 'client.cancelinvite',
	CheckLog = 'client.checklog',
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
	CheckLog = 'server.checklog',

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

	[ServerEvents.PlayerList]: {
		players: Array<string>
	  };

	[ServerEvents.LobbyList]: {
		lobbies: Array<SpectateInfo>;
	  };
	
	 [ServerEvents.CheckLog]: {
		logged: boolean;
	  };
  };