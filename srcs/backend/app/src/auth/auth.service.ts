import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dto/user.dto';
import { RegisterDto } from 'src/dto/register.dto';
import { LoginDto } from 'src/dto/login.dto';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>
	) {}

	login(loginDto: LoginDto)
	{
		return this.userRepository.find();
	}

	async register(registerDto: RegisterDto)
	{
		const user: User = new User();

		user.user_mail = registerDto.user_mail;
		user.user_pseudo = registerDto.user_pseudo;
		user.user_password = 'crypted' + registerDto.user_password + 'crypted';
		user.user_status = 0;
		user.user_JWT = 'placeholder JWT token';

		await this.userRepository.save(user);

		const retUserDto: UserDto = new UserDto();

		retUserDto.user_id = user.user_id;
		retUserDto.user_mail = user.user_mail;
		retUserDto.user_pseudo = user.user_pseudo;
		retUserDto.user_JWT = user.user_JWT;
		retUserDto.user_status = user.user_status;
		retUserDto.user_password = '';
		return (retUserDto);
	}
}