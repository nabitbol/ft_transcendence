import classes from './game.module.css'
import { useRef, useEffect, useState } from 'react'
import { Ball, Engine, Paddle } from '@ft-transcendence/libs/shared/game'
import useWindowSize from './useWindowSize';

function Game () {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isGameOver, setIsGameOver] = useState(false);
	const [width, height] = useWindowSize();

	const boxDimensions = { 
		box_width: 0,
		box_height: 0,
		box_x: 0,
		box_y: 0,
		box_border_width: 20,
	}
		
	useEffect(() => {

		let canvas: HTMLCanvasElement | null;
		let context: CanvasRenderingContext2D | null;
		let engine: Engine;
		let ball: Ball;
		let paddle_a: Paddle;
		let paddle_b: Paddle;
		let animationFrameId: number;
		let started_game = false;

		function initContext()
		{
			//Setup Event listener
			window.addEventListener('keydown', keyDown);
			window.addEventListener('keyup', keyUp);
	
			//Create canvas and context
			canvas = canvasRef.current;
			if (canvas == null)
				return 1;
			canvas.width = width;
			canvas.height = height;
			context = canvas.getContext('2d');
			if (context == null)
				return 1;
			
			//Setup box dimensions
			boxDimensions.box_width = 0.80 * width;
			boxDimensions.box_height = 0.80 * height;
			boxDimensions.box_x = 0.10 * width;
			boxDimensions.box_y = 0.10 * height;
	
			//Create game object
			engine = new Engine();
			ball = new Ball(width/2, height/2, boxDimensions.box_height * 0.02);
			paddle_a = new Paddle(boxDimensions.box_x + 20, height/2, 20, boxDimensions.box_height * 0.1);
			paddle_b = new Paddle(boxDimensions.box_width + boxDimensions.box_x - 40, height/2, 20, boxDimensions.box_height - 30);
	
			//Predraw box
			context.fillStyle = '#FFFFFF';
			context.fillRect(boxDimensions.box_x, boxDimensions.box_y, boxDimensions.box_width, boxDimensions.box_height);
			context.font = '48px serif';
			return 0;
		}
	
		const keyDown = function(event: any){
			if(event.key === 'ArrowUp')
				paddle_a.up = 1;
			if(event.key === 'ArrowDown')
				paddle_a.down = 1;
		};
			
		const keyUp = function(event: any){
			if(event.key === 'ArrowUp')
				paddle_a.up = 0;
			if(event.key === 'ArrowDown')
				paddle_a.down = 0;
		};

		if(started_game === false)	
		{
			started_game = true;
			initContext();
		}
		const render = () => {
			if(context)
				engine.render(context, {width, height}, boxDimensions, ball, paddle_a, paddle_b);
			if(engine.end_game === true)
			{
				setIsGameOver(true);
				return ;
			}
			animationFrameId = window.requestAnimationFrame(render);
		}
		if(!isGameOver)
			render();
		return () => {
			window.cancelAnimationFrame(animationFrameId);
			window.removeEventListener('keydown', keyDown);
			window.removeEventListener('keyup', keyUp);
		}
	},)

    return(

		<div className={classes.background}>
			{!isGameOver && <canvas ref={canvasRef}/>}
			{isGameOver && <span>Game over</span>}
		</div>
	)
}

export {Game};