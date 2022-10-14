import { Engine, GameInfo } from "@ft-transcendence/libs/shared/game";
import { Lobby } from './lobby';
import { ServerEvents, ServerPayloads } from "@ft-transcendence/libs-shared-types"

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
	  if (this.gameInfo.has_started) {
		return;
	  }
  
	  this.gameInfo.has_started = true;
  
	  this.lobby.sendMessage<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
		message: 'Game started !',
	  });
	}
  
	public endGame(): void
	{
	  if (this.gameInfo.has_ended || !this.gameInfo.has_started) {
		return;
	  }
  
	  this.gameInfo.has_ended = true;
  
	  this.lobby.sendMessage<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
		message: 'Game finished !',
	  });
	}

	public delay(ms: number) {
		return new Promise( resolve => setTimeout(resolve, ms) );
	};

	public launchGame(): void
	{
		(async () => { 
			while(this.gameInfo.has_ended === false)
			{
				this.gameEngine.render();
				this.lobby.sendGameInfo();
				await this.delay(20);
			}
			console.log("End game");
		})
	}

	public inputGame = (input) => {
		this.gameInfo.paddle_a.up = input.up;
		this.gameInfo.paddle_a.down = input.down; 
	}

	public getGameInfo() : GameInfo
	{
		return this.gameInfo;
	}
}