import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserService } from '../../user/user.service';

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
      throw new UnauthorizedException("This username is not associated with any account.");
    }
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException("Password incorrect.");
    }
    return user;
  }
}