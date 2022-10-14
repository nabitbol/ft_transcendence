import { GameInfo } from "@ft-transcendence/libs/shared/game";

export enum ClientEvents
{
	JoinRoom = 'client.joinroom',
	CreateRoom = 'client.createroom',
	LeaveRoom = 'client.leaveroom',
	EnterMatchMaking = 'client.entermatchmaking',
	LeaveMatchMaking = 'client.leavematchmaking',
}

export enum ServerEvents
{
	GameMessage = 'server.message',
	GameInfo = 'server.gameinfo'
}

export type ServerPayloads = {
	[ServerEvents.GameMessage]: {
	  message: string;
	};

	[ServerEvents.GameInfo]: {
		info: GameInfo;
	  };
	
	[ClientEvents.JoinRoom]: {
		message: string;
		roomId: number;
	};

	[ClientEvents.CreateRoom]: {
		message: string;
		roomId: number;
	};
  };