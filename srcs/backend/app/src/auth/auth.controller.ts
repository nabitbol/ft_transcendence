import { Body, Controller, Post, UseGuards, Request, Get, Res, Query, Req} from '@nestjs/common';
import { RegisterDto } from 'src/dto/register.dto';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { LocalAuthGuard } from './strategy/local-auth.guard';
import { TwoFactorAuthenticationService } from './services/twoFactorAuthentication.service';
import { JwtAuthGuard } from './strategy/jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor
	(
		private readonly authService: AuthService,
		private readonly apiService: ApiService,
		private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
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
	async Login(@Request() req: any) {
		return await this.authService.login(req.user);
	}

	@Post('register')
	async Register(@Body() registerDto: RegisterDto) {
		return await this.authService.register(registerDto);
	}

	@UseGuards(JwtAuthGuard)
	@Get('generate')
	async Generate(@Res() response: Response, @Req() request: any) {
		const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(request.user);
		return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
	}
}


