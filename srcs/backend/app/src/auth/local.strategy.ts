import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private userService: UserService) {
    super({
      usernameField: 'user_pseudo',
      passwordField: 'user_password',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    if(!await this.userService.findByUsername(username)) {
      throw new UnauthorizedException("L\'username que vous avez saisi n’est pas associé à un compte.");
    }
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException("Le mot de passe entré est incorrect.");
    }
    return user;
  }
}