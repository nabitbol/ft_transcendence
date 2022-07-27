import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dto/user.dto';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>
	) {}

	getAll()
	{
		return this.userRepository.find();
	}

	async createUser(userDto: UserDto)
	{
		const user: User = new User();

		user.user_mail = userDto.user_mail;
		user.user_pseudo = userDto.user_pseudo;
		user.user_JWT = userDto.user_JWT;
		user.user_status = userDto.user_status;

		await this.userRepository.save(user);

		const retUserDto: UserDto = new UserDto();

		retUserDto.user_id = user.user_id;
		retUserDto.user_mail = user.user_mail;
		retUserDto.user_pseudo = user.user_pseudo;
		retUserDto.user_JWT = user.user_JWT;
		retUserDto.user_status = user.user_status;
		return (retUserDto);
	}

	removeUser(id: string)
	{
		this.userRepository.delete(id);
	}
}
