import { Engine, GameInfo } from "@ft-transcendence/libs/shared/game";
import { Lobby } from './lobby';
import { ServerEvents, ServerPayloads } from "@ft-transcendence/libs-shared-types"
import { Socket } from 'socket.io';

export class GameInstance
{
	private gameInfo: GameInfo;
	private gameEngine: Engine;
	constructor(private lobby: Lobby)
	{
		this.gameInfo = new GameInfo({width: 1920, height: 1016});
		this.gameEngine = new Engine(this.gameInfo);
	}

	public startGame(): void
	{
		console.log("Start game");
		if (this.gameInfo.has_started) {
			return;
		}
	
		this.gameInfo.has_started = true;
		this.lobby.sendMessage<ServerPayloads[ServerEvents.GameStart]>(ServerEvents.GameStart, {
			message: 'Game started !',
		});
		this.launchGame();
	}
  

	public delay(ms: number) {
		return new Promise( resolve => setTimeout(resolve, ms) );
	};

	public async launchGame(): Promise<void>
	{
		(async () => { 
			while(this.gameInfo.has_ended === false)
			{
				this.gameEngine.render();
				this.lobby.sendGameInfo();
				await this.delay(20);
			}
			this.lobby.sendMessage<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
				message: 'Game finished !',
			});
		})();
		
	}

	public inputGame = (client: Socket, input) => {
		console.log(this.lobby.getClients().values().next().value.id);
		console.log(client.id);
		if(this.lobby.getClients().values().next().value.id === client.id)
		{
			this.gameInfo.paddle_a.up = input.up;
			this.gameInfo.paddle_a.down = input.down; 
		}
		else {
			this.gameInfo.paddle_b.up = input.up;
			this.gameInfo.paddle_b.down = input.down; 
		}
	}

	public getGameInfo() : GameInfo
	{
		return this.gameInfo;
	}
}