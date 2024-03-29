import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import {
  JwtDto,
  ResponseUserDto,
  UserDto,
} from "@ft-transcendence/libs-shared-types";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { UserService } from "@ft-transcendence/libs-backend-user";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async login(
    logged_user: UserDto,
    TwoFa_auth = false
  ): Promise<ResponseUserDto> {
    try {
      const user: UserDto = await this.usersService.getUserByName(
        logged_user.name
      );
      const payload: JwtDto = {
        name: user.name,
        TwoFa_auth: TwoFa_auth,
        sub: user.id,
      };
      const JWT_token = this.jwtService.sign(payload);

      const result: ResponseUserDto = {
        first_log: user.first_log,
        jwtToken: JWT_token,
        doubleAuth: user.doubleAuth,
        name: user.name,
      };
      const to_update: UserDto = user;
      to_update.first_log = false;
      await this.usersService.updateUser(to_update.name, to_update);
      return result;
    } catch (err) {
      throw new NotFoundException(err);
    }
  }

  async validateUser(username: string, pass: string): Promise<ResponseUserDto> {
    let user: UserDto;
    if (!(user = await this.usersService.getUserByName(username)))
      throw new UnauthorizedException(
        "This username is not associated with any account."
      );
    if (user.name_42 !== null)
      throw new UnauthorizedException(
        "Please connect with 42 api for this user."
      );
    if (user && (await this.compareHash(user.password, pass))) {
      const result: ResponseUserDto = user;
      return result;
    }
    throw new UnauthorizedException("Password incorrect.");
  }

  async register(registerDto: UserDto): Promise<ResponseUserDto> {
    try {
      if (await this.usersService.getUserByName(registerDto.name))
        throw new ConflictException(
          "This username is already associated with an account."
        );
      if (await this.usersService.getUserByEmail(registerDto.email))
        throw new ConflictException(
          "This email is already associated with an account."
        );
      const user: UserDto = new UserDto();

      user.name = registerDto.name;
      user.password = await this.hashString(registerDto.password);
      user.email = registerDto.email;
      user.image = "utilisateur";

      await this.usersService.addUser(user);
      const retUserDto: ResponseUserDto = user;

      return retUserDto;
    } catch (err) {
      if (err.message === "User not found") {
        const user: UserDto = new UserDto();

        user.name = registerDto.name;
        user.password = await this.hashString(registerDto.password);
        user.email = registerDto.email;
        user.image = "utilisateur";

        await this.usersService.addUser(user);
        const retUserDto: ResponseUserDto = user;

        return retUserDto;
      } else {
        throw err;
      }
    }
  }

  async hashString(textToEncrypt: string): Promise<string> {
    const saltRounds = 10;

    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(textToEncrypt, salt);
  }

  async compareHash(hash: string, textToCompare: string): Promise<boolean> {
    return await bcrypt.compare(textToCompare, hash);
  }
}
