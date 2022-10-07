import { AuthService } from './auth.service';
import { Body, Controller, Post, UseGuards, Get, Res, Query, Req, UnauthorizedException} from '@nestjs/common';
import { UserDto, TwofaDto } from "@ft-transcendence/libs-shared-types";
import { ApiService } from './api.service';
import { TwoFactorAuthenticationService } from './twoFactorAuthentification.service';
import { LocalAuthGuard } from './strategy/local-auth.guard';
import { JwtAuthGuard } from './strategy/jwt-auth.guard';
import { JwtTwoFactorGuard } from './strategy/jwt-two-factor.guard';
import { Response } from 'express';
import { UserService } from '@ft-transcendence/libs-backend-user';

@Controller('auth')
export class AuthController {
	constructor
	(
		private readonly authService: AuthService,
		private readonly apiService: ApiService,
		private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
		private readonly userService: UserService
	) {}

	@Get('login/42')
	async RedirApi(@Res() res: Response)
	{
		return res.redirect(302, process.env.API_URL);
	}

	@Get('login/api')
	async GetAccessToken(@Query('code') QueryParams: string)
	{
		const access_token : string = await this.apiService.postApi(QueryParams);
		const user: UserDto = await this.apiService.loginApi(access_token);
		return await this.apiService.registerApi(user);
	}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async Login(@Body() user: UserDto) {
		return await this.authService.login(user);
	}

	@Post('register')
	async Register(@Body() registerDto: UserDto) {
		return await this.authService.register(registerDto);
	}

	@UseGuards(JwtTwoFactorGuard)
	@Get('generateQr')
	async GenerateQr(@Res() response: Response, @Req() request: any) {
		const { otpauthUrl  } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(request.user);
		return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
	}

	@UseGuards(JwtTwoFactorGuard)
	@Post('activateTwoFa')
	async activateTwoFa( @Req() request: any, @Body() twoFactorAuthenticationCode: TwofaDto)
	{
		const isCodeValid: boolean = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
		twoFactorAuthenticationCode.twoFA, request.user
		);
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}
		if(request.user.user_TwoFa_on)
			await this.userService.setTwoFactorAuthenticationStatus(request.user.name, false);
		else
			await this.userService.setTwoFactorAuthenticationStatus(request.user.name, true);
	}

	@UseGuards(JwtAuthGuard)
	@Post('twoFa')
	async TwoFa( @Req() request: any, @Body() twoFactorAuthenticationCode: TwofaDto)
	{
		const isCodeValid: boolean = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
		twoFactorAuthenticationCode.twoFA, request.user
	  );
	  if (!isCodeValid) {
		throw new UnauthorizedException('Wrong authentication code');
	  }

	  return this.authService.login(request.user, true);
	}
}