import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dto/user.dto';
import { RegisterDto } from 'src/dto/register.dto';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import axios from "axios";
import * as bcrypt from 'bcrypt';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class AuthService {

	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private usersService: UserService,
		private readonly httpService: HttpService,
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
		user.user_elo = 500;
		user.user_rank = 0;
		user.user_status = 0;

		await this.userRepository.save(user);
		const { user_password, ...retUserDto } = user;

		return (retUserDto);
	}

	async postApi(code : string): Promise<any> 
	{
		const grant_type = 'authorization_code';
		const client_id = process.env.CLIENT_ID;
		const client_secret = process.env.CLIENT_SECRET;
		const base_url = 'https://api.intra.42.fr/oauth/token';
		const redirect_uri = 'http://localhost:' + process.env.PORT + '/auth/api';

		return axios
      .post(base_url, {
		grant_type,
        client_id,
		client_secret,
		code,
		redirect_uri
      })
      .then(response => {
        return response.data.access_token;
      })
	}

	async loginApi(access_token : string): Promise<any> 
	{
		const base_url = 'https://api.intra.42.fr/v2/me';

		const data = await firstValueFrom(
			this.httpService.get(base_url, {headers: { Authorization: `Bearer ${access_token}` }}).pipe(
				map((response) => {
					return response.data
				}),
			),
		);
		const user = new RegisterDto;
		user.user_mail = data.email;
		user.user_password = "";
		user.user_pseudo = data.login;

		return 
		
	}

	async registerApi(registerDto: RegisterDto): Promise<any> 
	{
		const newUser: User = new User();
		let payload: any;
		let ret: any;

		if(!(await this.usersService.findByUsername(registerDto.user_pseudo) && await this.usersService.findByMail(registerDto.user_mail)))
		{
			newUser.user_pseudo = registerDto.user_pseudo;
			newUser.user_password = await this.hashString(registerDto.user_password);
			newUser.user_mail = registerDto.user_mail;
			newUser.user_elo = 500;
			newUser.user_rank = 0;
			newUser.user_status = 0;
			await this.userRepository.save(newUser);
			payload = { user_pseudo: newUser.user_pseudo, sub: newUser.user_id };
			ret = newUser;
		}
		else
		{
			const oldUser = await this.usersService.findByUsername(registerDto.user_pseudo);
			payload = { user_pseudo: oldUser.user_pseudo, sub: oldUser.user_id };
			ret = oldUser;
		}
		ret.user_JWT = this.jwtService.sign(payload);
		return(ret);
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