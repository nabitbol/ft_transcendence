import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dto/user.dto';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

	constructor
	(
		@InjectRepository(User)
		private userRepository: Repository<User>
	) {}

	async getAll(): Promise<UserDto[] | undefined> 
	{
		return await this.userRepository.find();
	}

	async createUser(userDto: UserDto) : Promise<UserDto | undefined> 
	{
		const user: User = new User();

		user.user_mail = userDto.user_mail;
		user.user_pseudo = userDto.user_pseudo;
		user.user_JWT = userDto.user_JWT;
		user.user_status = userDto.user_status;
		user.user_password = 'crypted' + userDto.user_password + 'crypted';

		await this.userRepository.save(user);

		const retUserDto: UserDto = new UserDto();

		retUserDto.user_id = user.user_id;
		retUserDto.user_mail = user.user_mail;
		retUserDto.user_pseudo = user.user_pseudo;
		retUserDto.user_JWT = user.user_JWT;
		retUserDto.user_status = user.user_status;
		return (retUserDto);
	}

	async findByUsername(pseudo: string) : Promise<UserDto | undefined> 
	{
		return await this.userRepository.findOne({ where:{ user_pseudo: pseudo}});
	}

	async findById(id: number) : Promise<UserDto | undefined> 
	{
		return await this.userRepository.findOne({ where:{ user_id: id}});
	}

	async removeUser(id: number) : Promise<string> 
	{
		const user = await this.findById(id);
		if(user)
		{
			this.userRepository.remove(user);
			return ('User '+ id +' removed successfully');
		}
		return ('User '+ id +' doesnt exist !');
	}
}
