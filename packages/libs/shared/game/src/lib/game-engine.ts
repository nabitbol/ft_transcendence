export class Ball {
	circle_radius = 0;
	x_acceleration = 1.1;
	y_acceleration = 1.1;
	x_pos = 0;
	y_pos = 0;
	start_x_pos = 0;
	start_y_pos = 0;
	x_velocity = -5;
	y_velocity = 1;
	min_velocity = -25;
	max_velocity = 25;
	constructor(x_start: number, y_start: number, radius: number) {
		this.circle_radius = radius;
		this.x_pos = x_start;
		this.y_pos = y_start;
		this.start_x_pos = x_start;
		this.start_y_pos = y_start;
	}

	reset()
	{
		this.x_pos = this.start_x_pos;
		this.y_pos = this.start_y_pos;
		this.x_velocity = -5;
		this.y_velocity = 1;
	}
}

export class Paddle {
	x_pos = 0;
	y_pos = 0;
	width = 0;
	height = 0;
	up = 0;
	down = 0;
	constructor(x_pos: number, y_pos: number, width: number, height: number) {
		this.x_pos = x_pos;
		this.y_pos = y_pos - height/2;
		this.width = width;
		this.height = height
	}
}

export class Engine {
	context!: CanvasRenderingContext2D;
	canvasDimensions: any;
	boxDimensions: any;
	ball!: Ball;
	paddle_a!: Paddle;
	paddle_b!: Paddle;
	player_a_score = 0;
	player_b_score = 0;
	end_score = 5;
	end_game = false;

	render(context: CanvasRenderingContext2D, canvasDimensions:any, boxDimensions:any, ball: Ball, paddle_a: Paddle, paddle_b: Paddle) {
		this.canvasDimensions = canvasDimensions;
		this.boxDimensions = boxDimensions;
		this.context = context;
		this.ball = ball;
		this.paddle_a = paddle_a;
		this.paddle_b = paddle_b;
		this.game_tick();
	}

	draw()
	{
		if(this.context != null)
		{
			this.context.clearRect(this.boxDimensions.box_x + this.boxDimensions.box_border_width/2, this.boxDimensions.box_y + this.boxDimensions.box_border_width/2, this.boxDimensions.box_width - this.boxDimensions.box_border_width, this.boxDimensions.box_height - this.boxDimensions.box_border_width);
			this.context.fillRect(this.paddle_a.x_pos, this.paddle_a.y_pos, this.paddle_a.width, this.paddle_a.height);
			this.context.fillRect(this.paddle_b.x_pos, this.paddle_b.y_pos, this.paddle_b.width, this.paddle_b.height);

			this.context.fillText(this.player_a_score.toString(), this.boxDimensions.box_x + this.boxDimensions.box_width/2 - 100, this.boxDimensions.box_y + 100);
			this.context.fillText(this.player_b_score.toString(), this.boxDimensions.box_x + this.boxDimensions.box_width/2 + 100, this.boxDimensions.box_y + 100);
			this.context.beginPath()
			this.context.arc(this.ball.x_pos, this.ball.y_pos, this.ball.circle_radius, 0, 2*Math.PI)
			this.context.fill()
		}
	}
	game_tick()
	{
		this.ball_tick();
		if(this.end_game === true)
			return ;
		this.paddle_tick();
		this.draw();
	}

	paddle_tick()
	{
		if(this.paddle_a.up === 1)
		{
			if(this.paddle_a.y_pos - 10 >= this.boxDimensions.box_y)
				this.paddle_a.y_pos -= 10;
		}

		if(this.paddle_a.down === 1)
		{
			if(this.paddle_a.y_pos - 10 <= this.boxDimensions.box_height)
				this.paddle_a.y_pos += 10;
		}

		if(this.ball.x_pos + this.ball.circle_radius + this.ball.x_velocity >= this.paddle_b.x_pos)
		{
			if(this.ball.y_pos + this.ball.circle_radius >= this.paddle_b.y_pos && this.ball.y_pos - this.ball.circle_radius <= this.paddle_b.y_pos + this.paddle_b.height)
			{
				if(this.ball.x_velocity >= this.ball.min_velocity && this.ball.x_velocity <= this.ball.max_velocity)
					this.ball.x_velocity *= this.ball.x_acceleration;
				this.ball.x_velocity *= -1;
			}
		}
		if(this.ball.x_pos - this.ball.circle_radius + this.ball.x_velocity <= this.paddle_a.x_pos + this.paddle_a.width)
		{
			if(this.ball.y_pos + this.ball.circle_radius >= this.paddle_a.y_pos && this.ball.y_pos - this.ball.circle_radius <= this.paddle_a.y_pos + this.paddle_a.height)
			{
				if(this.ball.x_velocity >= this.ball.min_velocity && this.ball.x_velocity <= this.ball.max_velocity)
					this.ball.x_velocity *= this.ball.x_acceleration;
				this.ball.x_velocity *= -1;
			}
		}
	}

	ball_tick()
	{
		this.ball.x_pos += this.ball.x_velocity;
		this.ball.y_pos += this.ball.y_velocity;
		if((this.ball.x_pos + this.ball.circle_radius + this.ball.x_velocity) >= this.canvasDimensions.width - this.boxDimensions.box_x - this.boxDimensions.box_border_width/2)
		{
			this.player_a_score++;
			if(this.player_a_score >= this.end_score)
			{
				if(this.context)
					this.context.clearRect(0, 0, this.canvasDimensions.width, this.canvasDimensions.height);
				this.end_game = true;
			}
			this.ball.reset();
		}

		else if((this.ball.x_pos - this.ball.circle_radius + this.ball.x_velocity) <= this.boxDimensions.box_x + this.boxDimensions.box_border_width/2)
		{
			this.player_b_score++;
			if(this.player_b_score >= this.end_score)
			{
				if(this.context)
					this.context.clearRect(0, 0, this.canvasDimensions.width, this.canvasDimensions.height);
				this.end_game = true;
			}
			this.ball.reset();
		}
		if((this.ball.y_pos + this.ball.circle_radius + this.ball.y_velocity) >= this.canvasDimensions.height - this.boxDimensions.box_y - this.boxDimensions.box_border_width/2 ||
		(this.ball.y_pos - this.ball.circle_radius + this.ball.y_velocity) <= this.boxDimensions.box_y + this.boxDimensions.box_border_width/2)
		{
			if(this.ball.y_velocity >= -30 && this.ball.y_velocity <= 30)
				this.ball.y_velocity *= this.ball.y_acceleration;
			this.ball.y_velocity *= -1;
		}
	}
}