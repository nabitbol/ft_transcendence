import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dto/user.dto';
import { RegisterDto } from 'src/dto/register.dto';
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

	async createUser(registerDto: RegisterDto) : Promise<UserDto | undefined> 
	{
		const user: User = new User();

		user.user_pseudo = registerDto.user_pseudo;
		user.user_password = registerDto.user_password;
		user.user_mail = registerDto.user_mail;
		user.user_JWT = undefined;
		user.user_elo = 500;
		user.user_rank = 0;
		user.user_status = 0;
		
		await this.userRepository.save(user);

		const retUserDto: UserDto = new UserDto();

		retUserDto.user_id = user.user_id;
		retUserDto.user_pseudo = user.user_pseudo;
		retUserDto.user_password = user.user_password;
		retUserDto.user_mail = user.user_mail;
		retUserDto.user_JWT = user.user_JWT;
		retUserDto.user_elo = user.user_elo;
		retUserDto.user_rank = user.user_rank;
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

	async findByMail(mail: string) : Promise<UserDto | undefined> 
	{
		return await this.userRepository.findOne({ where:{ user_mail: mail}});
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

	async userExist(user_pseudo: string, user_mail: string): Promise<boolean> 
	{
		if(await this.findByUsername(user_pseudo))
			return(true);
		if(await this.findByMail(user_mail))
			return(true);
		return(false);
	}

}
