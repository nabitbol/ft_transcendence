import { Body, Controller, Get, Post, Delete, UseGuards, Request } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RegisterDto } from 'src/dto/register.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	getAll() {
		return this.userService.getAll();
	}

	@Post('create')
	createUser(@Body() registerDto: RegisterDto)
	{
		return this.userService.createUser(registerDto);
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

	@Delete('delete')
	RemoveUser(@Body('user_id') user_id: number)
	{
		return this.userService.removeUser(user_id);
	}

	@Get('profile')
	getProfile(@Request() req) {
	  return req.user;
	}
}
