import { Injectable } from "@nestjs/common";
import axios from "axios";
import { firstValueFrom, map } from "rxjs";
import { HttpService } from "@nestjs/axios";
import {
  JwtDto,
  ResponseUserDto,
  UserDto,
} from "@ft-transcendence/libs-shared-types";
 
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

  async postApi(code: string): Promise<string> {
    const grant_type = "authorization_code";
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const base_url = "https://api.intra.42.fr/oauth/token";
    const redirect_uri = "http://localhost:" + process.env.PORT + "/auth/api";

    return axios
      .post(base_url, {
        grant_type,
        client_id,
        client_secret,
        code,
        redirect_uri,
      })
      .then((response) => {
        return response.data.access_token;
      });
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

  async registerApi(registerDto: UserDto): Promise<ResponseUserDto> {
    const newUser: UserDto = new UserDto();
    let payload: JwtDto;
    let ret: ResponseUserDto;

    if (
      !(
        (await this.usersService.getUserByName(registerDto.name)) &&
        (await this.usersService.getUserByEmail(registerDto.email))
      )
    ) {
      newUser.name = registerDto.name;
      newUser.password = await this.authService.hashString(
        registerDto.password
      );
      newUser.email = registerDto.email;
      newUser.image = "utilisateur";
      await this.usersService.addUser(newUser);
      payload = {
        name: newUser.name,
        TwoFa_auth: newUser.doubleAuth,
        sub: newUser.id,
      };
      ret = newUser;
    } else {
      const oldUser = await this.usersService.getUserByName(registerDto.name);
      payload = {
        name: oldUser.name,
        TwoFa_auth: newUser.doubleAuth,
        sub: oldUser.id,
      };
      ret = oldUser;
    }
    ret.jwtToken = this.jwtService.sign(payload);
    return ret;
  }
}
