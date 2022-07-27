import { Body, Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	getAll() {
		return this.userService.getAll();
	}

	@Post()
	createUser(@Body() userDto: UserDto)
	{
		return this.userService.createUser(userDto);
	}

	@Delete(':id')
	RemoveTask(@Param('id') id: string)
	{
	  this.userService.removeUser(id);
	  return ('User removed successfully');
	} 
}
