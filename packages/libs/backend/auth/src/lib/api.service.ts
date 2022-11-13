import { Injectable, UnauthorizedException } from "@nestjs/common";
import axios from "axios";
import { firstValueFrom, map } from "rxjs";
import { HttpService } from "@nestjs/axios";
import {
  JwtDto,
  ResponseUserDto,
  UserDto,
} from "@ft-transcendence/libs-shared-types";
require("dotenv").config();
 
import { UserService } from "@ft-transcendence/libs-backend-user";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class ApiService {
  constructor(
    private usersService: UserService,
    private httpService: HttpService,
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  async postApi(code: string): Promise <string> {
    const grant_type = "authorization_code";
    const client_id = process.env.NX_CLIENT_ID;
    const client_secret = process.env.NX_CLIENT_SECRET;
    const base_url = "https://api.intra.42.fr/oauth/token";
    const redirect_uri = `http://${process.env.NX_HOST_NAME}:${process.env.NX_FRONTEND_PORT}/auth/api`; //process.env.PORT 

    const ret: any = await axios
      .post(base_url, {
        grant_type,
        client_id,
        client_secret,
        code,
        redirect_uri,
      })
      .catch (function (error){
        if (error.response) {
          throw new UnauthorizedException(error);

        }});
      return ret.data.access_token;
    }

  async loginApi(access_token: string): Promise<UserDto> {
    const base_url = "https://api.intra.42.fr/v2/me";

    const data = await firstValueFrom(
      this.httpService
        .get(base_url, { headers: { Authorization: `Bearer ${access_token}` } })
        .pipe(
          map((response) => {
            return response.data;
          })
        )
    );
    const user: UserDto = new UserDto();
    user.email = data.email;
    user.name = data.login;

    return user;
  }

  async getRandomName(): Promise<string> {
   
   let result           = 'user';
   const characters       = '0123456789';
   const charactersLength = characters.length;
    for (let i = 0; i < 10; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async registerApi(registerDto: UserDto): Promise<ResponseUserDto> {
    const newUser: UserDto = new UserDto();
    let payload: JwtDto;
    let ret: ResponseUserDto;

    if (await this.usersService.getUserByName42(registerDto.name) === null) 
    {
      if (await this.usersService.getUserByName(registerDto.name) === null)
        newUser.name = registerDto.name;
      else
        newUser.name = await this.getRandomName();
      newUser.name_42 = registerDto.name;
      newUser.email = registerDto.email;
      newUser.image = "utilisateur";
	  newUser.first_log = true;
	  newUser.doubleAuth = false;
      await this.usersService.addUser(newUser);
      payload = {
        name: newUser.name,
        TwoFa_auth: newUser.doubleAuth,
        sub: newUser.id,
      };
      ret = newUser;
    } else {
		const oldUser = await this.usersService.getUserByName42(registerDto.name);
		payload = {
        name: oldUser.name,
        TwoFa_auth: newUser.doubleAuth,
        sub: oldUser.id,
      };
      ret = oldUser;
      ret.first_log = false;
    }
	ret.jwtToken = this.jwtService.sign(payload);
	const result: ResponseUserDto = {
        first_log: ret.first_log,
        jwtToken: ret.jwtToken,
        doubleAuth: ret.doubleAuth,
        name: ret.name,
      };
    const to_update: UserDto = await this.usersService.getUserByName42(ret.name);
    to_update.first_log = false;
    await this.usersService.updateUser(to_update.name, to_update);
    return result;
  }
}
