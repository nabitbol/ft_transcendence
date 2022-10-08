import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserService } from '@ft-transcendence/libs-backend-user';
import { ResponseUserDto } from '@ft-transcendence/libs-shared-types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private userService: UserService) {
    super({
      usernameField: 'name',
      passwordField: 'password',
    });
  }

  async validate(name: string, password: string): Promise<ResponseUserDto> {
    const user = await this.authService.validateUser(name, password);
    return user;
  }
}