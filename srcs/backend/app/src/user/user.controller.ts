import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	getAll() {
		return this.userService.getAll();
	}

	@Post('name_find')
	findByUsername(@Body('user_pseudo') user_pseudo: string)
	{
		return this.userService.findByUsername(user_pseudo);
	}

	@Post('id_find')
	findById(@Body('user_id') user_id: number)
	{
		return this.userService.findById(user_id);
	}

	@Get('profile')
	getProfile(@Request() req) {
	  return req.user;
	}
}
