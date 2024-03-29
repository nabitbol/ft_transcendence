import { Engine, GameInfo } from "@ft-transcendence/libs/shared/game";
import { ServerEvents, ServerPayloads, MatchDto, UserDto, GameData } from "@ft-transcendence/libs-shared-types"
import { Socket, Server } from 'socket.io';
import { UserService } from "@ft-transcendence/libs-backend-user";
import { MatchService } from "@ft-transcendence/libs-backend-match";
import { JwtService } from "@nestjs/jwt";

export class GameInstance
{
	private jwtService: JwtService = new JwtService();
	private gameInfo: GameInfo;
	private gameEngine: Engine;
	private userservice: UserService = new UserService(this.jwtService);
	private matchservice: MatchService = new MatchService();
	private lostPlayer: string;

	constructor(private mode: 'simple' | 'double',
				private id: string,
				private server: Server)
	{
		this.resetGame();
	}

	public startGame(players_name: {right: string, left: string}): void
	{
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
  
	public async saveGameDisconnect(): Promise<MatchDto> 
	{
		const matchInfo: MatchDto = new MatchDto();
		matchInfo.players = [];
		if(this.lostPlayer === this.gameInfo.players_name.left)
		{
			matchInfo.winner = this.gameInfo.players_name.right;
			matchInfo.looser = this.gameInfo.players_name.left;
			matchInfo.winnerScore = this.gameInfo.player_b_score;
			matchInfo.looserScore = this.gameInfo.player_a_score;	
		}
		else
		{
			matchInfo.winner = this.gameInfo.players_name.left;
			matchInfo.looser = this.gameInfo.players_name.right;
			matchInfo.winnerScore = this.gameInfo.player_a_score;
			matchInfo.looserScore = this.gameInfo.player_b_score;
		}
		matchInfo.playersName = [this.gameInfo.players_name.left, this.gameInfo.players_name.right];
		matchInfo.players[0] = (await this.userservice.getUserByName(this.gameInfo.players_name.right)).id;
		matchInfo.players[1] = (await this.userservice.getUserByName(this.gameInfo.players_name.left)).id;
		await this.matchservice.addMatches(matchInfo);
		const playerWinner: UserDto = await this.userservice.getUserByName(matchInfo.winner);
		const playerLoser: UserDto = await this.userservice.getUserByName(matchInfo.looser);
		playerLoser.losses++;
		playerWinner.wins++;
		await this.userservice.updateUser(playerLoser.name, playerLoser);
		await this.userservice.updateUser(playerWinner.name, playerWinner);
		return (matchInfo)
	}

	public async saveGame(): Promise<MatchDto> 
	{
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
		await this.matchservice.addMatches(matchInfo);
		const playerWinner: UserDto = await this.userservice.getUserByName(matchInfo.winner);
		const playerLoser: UserDto = await this.userservice.getUserByName(matchInfo.looser);
		playerLoser.losses++;
		playerWinner.wins++;
		await this.userservice.updateUser(playerLoser.name, playerLoser);
		await this.userservice.updateUser(playerWinner.name, playerWinner);
		return (matchInfo)
	}

	public resetGame(): void
	{
		this.gameInfo = new GameInfo({width: 1920, height: 1016}, this.mode)
		this.gameEngine = new Engine(this.gameInfo);
		this.lostPlayer = undefined;
	}

	public async endGame(): Promise<void>
	{
		if (!this.gameInfo.has_started) {
			return;
		}
		this.gameInfo.has_ended = true;
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
					await this.endGame();
					break;
				}
				this.sendGameData();
				await this.delay(15);
			}
			if(this.lostPlayer)
			{
				this.sendMessage<ServerPayloads[ServerEvents.GameEnd]>(ServerEvents.GameEnd, {
					result: await this.saveGameDisconnect(),
				});
			}
			else
			{
				this.sendMessage<ServerPayloads[ServerEvents.GameEnd]>(ServerEvents.GameEnd, {
					result: await this.saveGame(),
				});
			};
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

	public getGameData() : GameData
	{
		const data: GameData = {
			paddle_a: this.gameInfo.paddle_a,
			paddle_b: this.gameInfo.paddle_b,
			player_a_score: this.gameInfo.player_a_score,
			player_b_score: this.gameInfo.player_b_score,
			players_name: this.gameInfo.players_name,
			ball: this.gameInfo.ball,
			has_ended: this.gameInfo.has_ended,
			has_started: this.gameInfo.has_started,
		}
		return data;
	}

	public setLostPlayer(player: string)
	{
		this.lostPlayer = player;
	}

	public sendGameData(): void
	{
	  const payload: ServerPayloads[ServerEvents.GameInfo] = {
	   info: this.getGameData(),
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
