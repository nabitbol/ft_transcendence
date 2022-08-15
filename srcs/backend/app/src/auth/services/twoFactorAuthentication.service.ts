import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { UserService } from '../../user/user.service';
import { UserDto } from 'src/dto/user.dto';
import { toFileStream } from 'qrcode';
import { Response } from 'express';

@Injectable()
export class TwoFactorAuthenticationService {

  constructor (
    private readonly usersService: UserService
  ) {}
 
  public async generateTwoFactorAuthenticationSecret(user: UserDto): Promise<any> {
    const secret: string = authenticator.generateSecret();
 
    const otpauthUrl: string = authenticator.keyuri(user.user_mail, process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME, secret);
 
    await this.usersService.setTwoFactorAuthenticationSecret(user.user_id, secret);
 
    return {
      secret,
      otpauthUrl
    }
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return await toFileStream(stream, otpauthUrl);
  }

  public async isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: UserDto) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.user_TwoFa_secret
    })
  }
}