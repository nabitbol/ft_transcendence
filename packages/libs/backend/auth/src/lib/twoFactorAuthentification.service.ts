import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { UserService } from '@ft-transcendence/libs-backend-user';
import { UserDto } from "@ft-transcendence/libs-shared-types";
import { toFileStream } from 'qrcode';
import { Response } from "express";

@Injectable()
export class TwoFactorAuthenticationService {

  constructor (
    private readonly usersService: UserService
  ) {}
 
  public async generateTwoFactorAuthenticationSecret(user: UserDto): Promise<string> {
    let secret: string;
    if(user.doubleAuthSecret)
     secret = user.doubleAuthSecret;
    else
    {
      secret = authenticator.generateSecret();
      await this.usersService.setTwoFactorAuthenticationSecret(user.name, secret);
    }
    const otpauthUrl: string = authenticator.keyuri(user.email, process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME || 'chicken', secret);
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