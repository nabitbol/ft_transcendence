import { Injectable } from '@nestjs/common';
import axios from "axios";
import { firstValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { RegisterDto } from 'src/dto/register.dto';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UserService } from '../../user/user.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ApiService {
  constructor (
	@InjectRepository(User)
	private userRepository: Repository<User>,
    private usersService: UserService,
	private httpService: HttpService,
	private authService: AuthService,
	private jwtService: JwtService,
  ) {}
 
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

  async loginApi(access_token : string): Promise<RegisterDto> 
  {
	  const base_url = 'https://api.intra.42.fr/v2/me';

	  const data = await firstValueFrom(
		  this.httpService.get(base_url, {headers: { Authorization: `Bearer ${access_token}` }}).pipe(
			  map((response) => {
				  return response.data
			  }),
		  ),
	  );
	  const user: RegisterDto = new RegisterDto;
	  user.user_mail = data.email;
	  user.user_password = "";
	  user.user_pseudo = data.login;

	  return user;
	  
  }

  async registerApi(registerDto: RegisterDto): Promise<any> 
  {
	  const newUser: User = new User();
	  let payload: any;
	  let ret: any;

	  if(!(await this.usersService.findByUsername(registerDto.user_pseudo) && await this.usersService.findByMail(registerDto.user_mail)))
	  {
		  newUser.user_pseudo = registerDto.user_pseudo;
		  newUser.user_password = await this.authService.hashString(registerDto.user_password);
		  newUser.user_mail = registerDto.user_mail;
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
}