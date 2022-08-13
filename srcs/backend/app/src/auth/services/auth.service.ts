import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dto/user.dto';
import { RegisterDto } from 'src/dto/register.dto';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private usersService: UserService,
		private jwtService: JwtService,
	){}

	async login(user: any): Promise<any> {
		const payload = { user_pseudo: user.user_pseudo, sub: user.user_id };
		const JWT_token = this.jwtService.sign(payload);
		
		const { user_password, ... result } = user;
		result.user_JWT = JWT_token;
		return(result);
	}

	async validateUser(username: string, pass: string): Promise<any> 
	{
		const user: UserDto = await this.usersService.findByUsername(username);
		if (user && this.compareHash(user.user_password, pass)) {
		  const { user_password, ...result } = user;
		  return result;
		}
		return null;
	}

	async register(registerDto: RegisterDto): Promise<any> 
	{
		if(await this.usersService.findByUsername(registerDto.user_pseudo))
			throw new ConflictException("This username is already associated with an account.")
		if(await this.usersService.findByMail(registerDto.user_mail))
			throw new ConflictException("This email is already associated with an account.")
		
		const user: User = new User();

		user.user_pseudo = registerDto.user_pseudo;
		user.user_password =  await this.hashString(registerDto.user_password);
		user.user_mail = registerDto.user_mail;

		await this.userRepository.save(user);
		const { user_password, ...retUserDto } = user;

		return (retUserDto);
	}

	async hashString(textToEncrypt: string): Promise<string> 
	{
		const saltRounds = 10;
		
		const salt = await bcrypt.genSalt(saltRounds);
		return await bcrypt.hash(textToEncrypt, salt);
	}

	async compareHash(hash: string, textToCompare: string): Promise<boolean> 
	{
		return await bcrypt.compare(hash, textToCompare);
	}

}