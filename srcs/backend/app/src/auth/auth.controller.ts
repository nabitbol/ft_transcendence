import { Body, Controller, Post, UseGuards, Get, Res, Query, Req, UnauthorizedException} from '@nestjs/common';
import { RegisterDto } from 'src/dto/register.dto';
import { twoFactorAuthenticationDto } from 'src/dto/twoFactorAuthentication.dto';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { TwoFactorAuthenticationService } from './services/twoFactorAuthentication.service';
import { LocalAuthGuard } from './strategy/local-auth.guard';
import { JwtAuthGuard } from './strategy/jwt-auth.guard';
import { JwtTwoFactorGuard } from './strategy/jwt-two-factor.guard';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { AuthGuard } from '@nestjs/passport';

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
	async RedirApi(@Res() res: any)
	{
		return res.redirect(302, process.env.API_URL);
	}

	@Get('login/api')
	async GetAccessToken(@Query('code') QueryParams: string)
	{
		const access_token = await this.apiService.postApi(QueryParams);
		return this.apiService.loginApi(access_token);
	}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async Login(@Req() request: any) {
		return await this.authService.login(request.user);
	}

	@Post('register')
	async Register(@Body() registerDto: RegisterDto) {
		return await this.authService.register(registerDto);
	}

	@UseGuards(JwtTwoFactorGuard)
	@Get('generateQr')
	async GenerateQr(@Res() response: Response, @Req() request: any) {
		const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(request.user);
		return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
	}

	@UseGuards(JwtTwoFactorGuard)
	@Post('activateQr')
	async activateQr( @Req() request: any, @Body() twoFactorAuthenticationCode: twoFactorAuthenticationDto)
	{
		const isCodeValid: boolean = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
		twoFactorAuthenticationCode.twoFactorAuthentication, request.user
		);
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}
		if(request.user.user_TwoFa_on)
			await this.userService.setTwoFactorAuthenticationStatus(request.user.user_id, false);
		else
			await this.userService.setTwoFactorAuthenticationStatus(request.user.user_id, true);
	}

	@UseGuards(JwtAuthGuard)
	@Post('twoFa')
	async TwoFa( @Req() request: any, @Body() twoFactorAuthenticationCode: twoFactorAuthenticationDto)
	{
		const isCodeValid: boolean = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
		twoFactorAuthenticationCode.twoFactorAuthentication, request.user
	  );
	  if (!isCodeValid) {
		throw new UnauthorizedException('Wrong authentication code');
	  }

	  return this.authService.login(request.user, true);
	}


























	@UseGuards(JwtTwoFactorGuard)
	@Get('test3')
	async test3() {
		return await this.userService.getAll();
	}
}


