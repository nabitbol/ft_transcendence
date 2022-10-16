import { GameInfo } from "@ft-transcendence/libs/shared/game";

export enum ClientEvents
{
	EnterMatchMaking = 'client.entermatchmaking',
	GameInput = 'client.gameinput',
	CreateRoom = 'client.createroom',
	JoinRoom = 'client.joinroom',
	LeaveRoom = 'client.leaveroom',
}

export enum ServerEvents
{
	GameMessage = 'server.message',
	GameInfo = 'server.gameinfo',
	GameStart = 'server.gamestart',
	LobbyJoined = 'server.lobbyjoined',
	lobbyCreated = 'server.lobbycreated'
}

export type ServerPayloads = {
	[ServerEvents.GameMessage]: {
	  message: string;
	};

	[ServerEvents.LobbyJoined]: {
		message: string;
	  };

	[ServerEvents.lobbyCreated]: {
		message: string;
		lobbyId: number;
	  };

	[ServerEvents.GameInfo]: {
		info: GameInfo;
	  };

	[ServerEvents.GameStart]: {
		message: string;
	  };
  };