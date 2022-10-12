import { Engine, GameInfo } from "@ft-transcendence/libs/shared/game";

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
};

let gameInfo: GameInfo;

const registerGameHandlers = (io, socket) => {

	const launchGame = () => {
		console.log("Game launched:");
		gameInfo = new GameInfo({width: 1920, height: 1016});
		const game = new Engine(gameInfo);
		
		io.emit('game:launch');
		(async () => { 
			while(game.gameInfo.end_game === false)
			{
				game.render();
				io.volatile.emit('game:info', gameInfo);
				await delay(20);
			}
			console.log("End game");
		})()

	}

	const inputGame = (input) => {
		gameInfo.paddle_a.up = input.up;
		gameInfo.paddle_a.down = input.down; 
	}

	socket.on("game:launch", launchGame);
	socket.on("game:input", inputGame);
  }

export {registerGameHandlers}