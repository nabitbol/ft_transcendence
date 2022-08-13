import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from '../../entity/user.entity';
import { UserService } from '../../user/user.service';
 
@Injectable()
export class TwoFactorAuthenticationService {
  constructor (
    private readonly usersService: UserService
  ) {}
 
  public async generateTwoFactorAuthenticationSecret(user: User) {
    const secret: string = authenticator.generateSecret();
 
    const otpauthUrl: string = authenticator.keyuri(user.user_mail, process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME, secret);
 
    await this.usersService.setTwoFactorAuthenticationSecret(user.user_id, secret);
 
    return {
      secret,
      otpauthUrl
    }
  }
}