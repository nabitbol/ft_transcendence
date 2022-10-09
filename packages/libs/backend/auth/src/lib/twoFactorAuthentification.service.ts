import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { UserService } from '@ft-transcendence/libs-backend-user';
import { UserDto } from "@ft-transcendence/libs-shared-types";
import { toFileStream } from 'qrcode';
import { Response } from 'express';

@Injectable()
export class TwoFactorAuthenticationService {

  constructor (
    private readonly usersService: UserService
  ) {}
 
  public async generateTwoFactorAuthenticationSecret(user: UserDto): Promise<string> {
    const secret: string = authenticator.generateSecret();
 
    const otpauthUrl: string = authenticator.keyuri(user.email, process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME || 'chicken', secret);
 
    await this.usersService.setTwoFactorAuthenticationSecret(user.name, secret);
 
    return (otpauthUrl);
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return await toFileStream(stream, otpauthUrl);
  }

  public async isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: UserDto) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.doubleAuthSecret
    })
  }
}