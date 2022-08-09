import { Injectable, ConflictException, UnauthorizedException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dto/user.dto';
import { RegisterDto } from 'src/dto/register.dto';
import { User } from 'src/entity/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import axios from "axios";
import { firstValueFrom, map } from 'rxjs';
import { response } from 'express';

@Injectable()
export class AuthService {

	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private usersService: UserService,
		private readonly httpService: HttpService,
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
		if(await this.usersService.findByUsername(registerDto.user_pseudo))
			throw new ConflictException("This username is already associated with an account.")
		if(await this.usersService.findByMail(registerDto.user_mail))
			throw new ConflictException("This email is already associated with an account.")
		
		const user: User = new User();

		user.user_pseudo = registerDto.user_pseudo;
		user.user_password = registerDto.user_password;
		user.user_mail = registerDto.user_mail;
		user.user_JWT = '';
		user.user_elo = 500;
		user.user_rank = 0;
		user.user_status = 0;

		await this.userRepository.save(user);
		const { user_password, user_JWT, ...retUserDto } = user;

		return (retUserDto);
	}

	async postApi(code : string)
	{
		const grant_type = 'authorization_code';
		const client_id = process.env.CLIENT_ID
		const client_secret = process.env.CLIENT_SECRET
		const base_url = 'https://api.intra.42.fr/oauth/token';
		const redirect_uri = 'http://localhost:3000/auth/login/api'

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
      });
	}
	async loginApi(access_token : string)
	{
		const base_url = 'https://api.intra.42.fr/v2/me';

		const data = await firstValueFrom(
			this.httpService.get(base_url, {headers: { Authorization: `Bearer ${access_token}` }}).pipe(
				map((response) => {
					return response.data
				}),
			),
		);
		const email = data.email;
		const username = data.login;
		
	}
}