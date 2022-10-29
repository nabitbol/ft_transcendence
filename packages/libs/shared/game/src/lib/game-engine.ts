 
import { PlayersName } from '@ft-transcendence/libs-shared-types'

export class GameInfo {
	canvasDimensions: {width: number, height: number};
	boxDimensions: boxDimensions;
	ball: Array<Ball> = new Array<Ball>();
	paddle_a: Paddle;
	paddle_b: Paddle;
	player_a_score: number;
	player_b_score: number;
	end_score: number;
	has_started: boolean;
	has_ended: boolean;
	mode: 'simple' | 'double';
	players_name: PlayersName = {left: undefined, right: undefined};

	copyInfo(other: GameInfo) {
		this.ball = other.ball;
		this.paddle_a = other.paddle_a;
		this.paddle_b = other.paddle_b;
		this.player_a_score = other.player_a_score;
		this.player_b_score = other.player_b_score;
		this.end_score = other.end_score;
		this.has_started = other.has_started;
		this.has_ended = other.has_ended;
	}

	constructor(canvasDimensions: {width: number, height: number},  mode: 'simple' | 'double') {
		this.mode = mode;
		this.canvasDimensions = canvasDimensions;
		this.boxDimensions = new boxDimensions((0.8 * canvasDimensions.width),
			(0.8 * canvasDimensions.height),
			(0.1 * canvasDimensions.width),
			(0.1 * canvasDimensions.height), 20);
		this.end_score = 5;
		this.ball.push(new Ball(canvasDimensions.width / 2, canvasDimensions.height / 2,
		this.boxDimensions.box_height * 0.02));
		if(this.mode === 'double')
		{
			this.end_score = 100;
			this.ball.push(new Ball(canvasDimensions.width / 2, canvasDimensions.height / 2,
			this.boxDimensions.box_height * 0.02));
		}
		this.paddle_a = new Paddle(
			this.boxDimensions.box_x + 20,
			canvasDimensions.height / 2,
			20,
			this.boxDimensions.box_height * 0.1
		  );

		this.paddle_b = new Paddle(
        this.boxDimensions.box_width + this.boxDimensions.box_x - 40,
        canvasDimensions.height / 2,
        20,
        this.boxDimensions.box_height * 0.1
      );

		this.player_a_score = 0;
		this.player_b_score = 0;
		this.has_ended = false;
	}
}

export class boxDimensions {
	box_width: number
	box_height: number
	box_x: number
	box_y: number
	box_border_width: number
	constructor(box_width: number, box_height: number ,box_x: number,
		box_y: number ,box_border_width: number ) {

		this.box_width = box_width;
		this.box_height = box_height;
		this.box_x = box_x;
		this.box_y = box_y;
		this.box_border_width = box_border_width;
	}
}

export class Ball {
	circle_radius: number;
	x_pos: number;
	y_pos: number;
	start_x_pos: number;
	start_y_pos: number;
	x_acceleration: number;
	y_acceleration: number;
	x_velocity: number;
	y_velocity: number;
	min_velocity_x: number;
	max_velocity_x: number;
	min_velocity_y: number;
	max_velocity_y: number;
	constructor(x_start: number, y_start: number, radius: number) {
		this.circle_radius = radius;
		this.x_pos = x_start;
		this.y_pos = y_start;
		this.start_x_pos = x_start;
		this.start_y_pos = y_start;
		this.x_acceleration = 1.2;
		this.y_acceleration = 1.2;
		this.min_velocity_x = -20;
		this.max_velocity_x = 20;
		this.min_velocity_y = -15;
		this.max_velocity_y = 15;
		this.reset();
	}

	reset()
	{
		this.x_pos = this.start_x_pos;
		this.y_pos = this.start_y_pos;
		this.x_velocity = Math.random() * (8 - 5) + 5;
		if(Math.round(Math.random()))
			this.x_velocity *= -1;
		this.y_velocity = Math.random() * (8 - 5) + 5;
		if(Math.round(Math.random()))
			this.y_velocity *= -1;
	}
}

export class Paddle {
	x_pos = 0;
	y_pos = 0;
	width = 0;
	height = 0;
	up = 0;
	down = 0;
	paddle_speed = 10;
	constructor(x_pos: number, y_pos: number, width: number, height: number) {
		this.x_pos = x_pos;
		this.y_pos = y_pos - height/2;
		this.width = width;
		this.height = height
	}
}

export class Engine {

	constructor(private gameInfo: GameInfo) {}

	getGameInfo(): GameInfo {
		return this.gameInfo;
	}

	render()
	{
		if(this.gameInfo.has_ended === true)
			return ;
		this.ball_tick();
		this.paddle_tick();
	}

	paddle_tick()
	{
		if(this.gameInfo.paddle_a.up === 1)
		{
			if(this.gameInfo.paddle_a.y_pos - this.gameInfo.paddle_a.paddle_speed >= this.gameInfo.boxDimensions.box_y)
				this.gameInfo.paddle_a.y_pos -= this.gameInfo.paddle_a.paddle_speed;
		}

		if(this.gameInfo.paddle_a.down === 1)
		{
			if(this.gameInfo.paddle_a.y_pos - this.gameInfo.paddle_a.paddle_speed <= this.gameInfo.boxDimensions.box_height)
				this.gameInfo.paddle_a.y_pos += this.gameInfo.paddle_a.paddle_speed;
		}

		if(this.gameInfo.paddle_b.up === 1)
		{
			if(this.gameInfo.paddle_b.y_pos - this.gameInfo.paddle_b.paddle_speed >= this.gameInfo.boxDimensions.box_y)
				this.gameInfo.paddle_b.y_pos -= this.gameInfo.paddle_b.paddle_speed;
		}

		if(this.gameInfo.paddle_b.down === 1)
		{
			if(this.gameInfo.paddle_b.y_pos - this.gameInfo.paddle_b.paddle_speed <= this.gameInfo.boxDimensions.box_height)
				this.gameInfo.paddle_b.y_pos += this.gameInfo.paddle_b.paddle_speed;
		}

		for(const ball of this.gameInfo.ball)
		{

			if(ball.x_pos + ball.circle_radius + ball.x_velocity >= this.gameInfo.paddle_b.x_pos)
			{
				if(ball.y_pos + ball.circle_radius >= this.gameInfo.paddle_b.y_pos && ball.y_pos - ball.circle_radius <= this.gameInfo.paddle_b.y_pos + this.gameInfo.paddle_b.height)
				{
					if(ball.x_velocity >= ball.min_velocity_x && ball.x_velocity <= ball.max_velocity_x)
						ball.x_velocity *= ball.x_acceleration;
					
					if(ball.y_velocity >= ball.min_velocity_y && ball.y_velocity <= ball.max_velocity_y)
						ball.y_velocity *= ball.y_acceleration;

						ball.x_velocity *= -1;
				}
			}
			if(ball.x_pos - ball.circle_radius + ball.x_velocity <= this.gameInfo.paddle_a.x_pos + this.gameInfo.paddle_a.width)
			{
				if(ball.y_pos + ball.circle_radius >= this.gameInfo.paddle_a.y_pos && ball.y_pos - ball.circle_radius <= this.gameInfo.paddle_a.y_pos + this.gameInfo.paddle_a.height)
				{
					if(ball.x_velocity >= ball.min_velocity_x && ball.x_velocity <= ball.max_velocity_x)
					ball.x_velocity *= ball.x_acceleration;
					ball.x_velocity *= -1;
				}
			}
		}
	}

	ball_tick()
	{
		for(const ball of this.gameInfo.ball)
		{
			ball.x_pos += ball.x_velocity;
			ball.y_pos += ball.y_velocity;
			if((ball.x_pos + ball.circle_radius + ball.x_velocity) >= this.gameInfo.canvasDimensions.width - this.gameInfo.boxDimensions.box_x - this.gameInfo.boxDimensions.box_border_width/2)
			{
				this.gameInfo.player_a_score++;
				if(this.gameInfo.player_a_score >= this.gameInfo.end_score)
					return this.gameInfo.has_ended = true;
				ball.reset();
			}

			else if((ball.x_pos - ball.circle_radius + ball.x_velocity) <= this.gameInfo.boxDimensions.box_x + this.gameInfo.boxDimensions.box_border_width/2)
			{
				this.gameInfo.player_b_score++;
				if(this.gameInfo.player_b_score >= this.gameInfo.end_score)
					return this.gameInfo.has_ended = true;
				ball.reset();
			}
			if((ball.y_pos + ball.circle_radius + ball.y_velocity) >= this.gameInfo.canvasDimensions.height - this.gameInfo.boxDimensions.box_y - this.gameInfo.boxDimensions.box_border_width/2 ||
			(ball.y_pos - ball.circle_radius + ball.y_velocity) <= this.gameInfo.boxDimensions.box_y + this.gameInfo.boxDimensions.box_border_width/2)
				ball.y_velocity *= -1;
		}
	}
}