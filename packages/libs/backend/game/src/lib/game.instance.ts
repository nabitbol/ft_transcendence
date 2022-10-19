import { Engine, GameInfo } from "@ft-transcendence/libs/shared/game";
import { ServerEvents, ServerPayloads, ResultGame, MatchDto } from "@ft-transcendence/libs-shared-types"
import { Socket, Server } from 'socket.io';
import { UserService } from "@ft-transcendence/libs-backend-user";
import { MatchService } from "@ft-transcendence/libs-backend-match";

export class GameInstance
{
	private gameInfo: GameInfo;
	private gameEngine: Engine;
	private userservice: UserService = new UserService();
	private matchservice: MatchService = new MatchService();

	constructor(private mode: 'simple' | 'double',
				private id: string,
				private server: Server)
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
		this.sendMessage<ServerPayloads[ServerEvents.GameStart]>(ServerEvents.GameStart, {
			message: 'Game started !',
		});
		this.launchGame();
	}
  
	public async saveGame(): Promise<void> 
	{
		console.log("SAVING GAMEE HEREEE");
		const matchInfo: MatchDto = new MatchDto();
		matchInfo.players = [];
		if(this.gameInfo.player_a_score > this.gameInfo.player_b_score)
		{
			matchInfo.winner = this.gameInfo.players_name.left;
			matchInfo.looser = this.gameInfo.players_name.right;
			matchInfo.winnerScore = this.gameInfo.player_a_score;
			matchInfo.looserScore = this.gameInfo.player_b_score;

		}
		else
		{
			matchInfo.winner = this.gameInfo.players_name.right;
			matchInfo.looser = this.gameInfo.players_name.left;
			matchInfo.winnerScore = this.gameInfo.player_b_score;
			matchInfo.looserScore = this.gameInfo.player_a_score;
		}
		matchInfo.playersName = [this.gameInfo.players_name.left, this.gameInfo.players_name.right];
		matchInfo.players[0] = (await this.userservice.getUserByName(this.gameInfo.players_name.right)).id;
		matchInfo.players[1] = (await this.userservice.getUserByName(this.gameInfo.players_name.left)).id;
		console.log(matchInfo);
		await this.matchservice.addMatches(matchInfo);
	}

	public resetGame(): void
	{
		this.gameInfo = new GameInfo({width: 1920, height: 1016}, this.mode)
		this.gameEngine = new Engine(this.gameInfo);
	}

	public createResult(): ResultGame
	{
		let winner: string;
		let loser: string;
		if(this.gameInfo.player_a_score > this.gameInfo.player_b_score)
		{
			winner = this.gameInfo.players_name.left;
			loser = this.gameInfo.players_name.right;
		}
		else
		{
			winner = this.gameInfo.players_name.right;
			loser = this.gameInfo.players_name.left;
		}
		const result: ResultGame = {
			winner: winner,
			loser: loser,
			score: {left: this.gameInfo.player_a_score, right: this.gameInfo.player_b_score}
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
		this.sendMessage<ServerPayloads[ServerEvents.GameEnd]>(ServerEvents.GameEnd, {
			result: this.createResult(),
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
				{
					this.saveGame();
					return this.endGame();
				}
				this.sendGameInfo();
				await this.delay(20);
			}
		})();	
	}

	public inputGame = (client: Socket, input) => {
		if(this.gameInfo.players_name.left === client.data.user.name)
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

	public sendGameInfo(): void
	{
	  const payload: ServerPayloads[ServerEvents.GameInfo] = {
	   info: this.getGameInfo(),
	  };
	  this.sendVolatileMessage(ServerEvents.GameInfo, payload);
	}
  
	public sendMessage<T>(event: ServerEvents, payload: T): void
	{
	  this.server.to(this.id).emit(event, payload);
	}
  
	public sendVolatileMessage<T>(event: ServerEvents, payload: T): void
	{
	  this.server.volatile.to(this.id).emit(event, payload);
	}
}