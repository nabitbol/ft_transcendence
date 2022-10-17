import { Engine, GameInfo } from "@ft-transcendence/libs/shared/game";
import { Lobby } from './lobby';
import { ServerEvents, ServerPayloads, ResultGame } from "@ft-transcendence/libs-shared-types"
import { Socket } from 'socket.io';

export class GameInstance
{
	private gameInfo: GameInfo;
	private gameEngine: Engine;
	constructor(private lobby: Lobby, private mode: 'simple' | 'double')
	{
		this.resetGame();
	}

	public startGame(players_name: {right: string, left: string}): void
	{
		console.log("Start game:" + players_name.left + ' VS ' + players_name.right);
		if (this.gameInfo.has_started) {
			return;
		}
		this.gameInfo.players_name.left = players_name.left;
		this.gameInfo.players_name.right = players_name.right;
		this.gameInfo.has_started = true;
		this.lobby.sendMessage<ServerPayloads[ServerEvents.GameStart]>(ServerEvents.GameStart, {
			message: 'Game started !',
		});
		this.launchGame();
	}
  

	public resetGame(): void
	{
		this.gameInfo = new GameInfo({width: 1920, height: 1016}, this.mode)
		this.gameEngine = new Engine(this.gameInfo);
	}

	public createResult(): ResultGame
	{
		const result: ResultGame = {
			winner: "hardcodead",
			loser: "hardcodead",
			score: {left: 666, right: 69}
		}
		return result;
	}

	public async endGame(): Promise<void>
	{
		if (!this.gameInfo.has_started) {
			return;
		}
		
		console.log("End game");
		this.gameInfo.has_ended = true;
		const result: ResultGame = this.createResult()
		this.lobby.sendMessage<ServerPayloads[ServerEvents.GameEnd]>(ServerEvents.GameEnd, {
			result: result,
		});
	}

	public delay(ms: number) {
		return new Promise( resolve => setTimeout(resolve, ms) );
	};

	public async launchGame(): Promise<void>
	{
		(async () => { 
			while(this.gameInfo.has_started === true)
			{
				this.gameEngine.render();
				if(this.gameInfo.has_ended === true)
					return this.endGame();
				this.lobby.sendGameInfo();
				await this.delay(20);
			}
		})();	
	}

	public inputGame = (client: Socket, input) => {
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