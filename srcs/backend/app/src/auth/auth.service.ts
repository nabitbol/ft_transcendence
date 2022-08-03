import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dto/user.dto';
import { RegisterDto } from 'src/dto/register.dto';
import { User } from 'src/entity/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private usersService: UserService,
		private jwtService: JwtService,
	) {}

	async login(user: any): Promise<UserDto> {
		const payload = { user_pseudo: user.user_pseudo, sub: user.user_id };
		const ret: UserDto = user;
		ret.user_JWT = this.jwtService.sign(payload);
		return(ret);
	}

	async validateUser(username: string, pass: string): Promise<any> 
	{
		const user: UserDto = await this.usersService.findByUsername(username);
		if (user && user.user_password === pass) {
		  const { user_password, ...result } = user;
		  return result;
		}
		return null;
	}

	async register(registerDto: RegisterDto): Promise<any> 
	{
		const user: User = new User();

		user.user_mail = registerDto.user_mail;
		user.user_pseudo = registerDto.user_pseudo;
		user.user_password = registerDto.user_password;
		user.user_status = 0;
		user.user_JWT = 'placeholder JWT token';

		await this.userRepository.save(user);
		const { user_password, user_status, user_JWT, ...retUserDto } = user;
		return (retUserDto);
	}
}